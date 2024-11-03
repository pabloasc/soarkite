import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
});

// Create bucket and set up storage policies if they don't exist
export const initializeStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets?.find(bucket => bucket.name === 'soarkite')) {
      // Create bucket
      await supabase.storage.createBucket('soarkite', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
      });

      // Set up storage policies
      await supabase.rpc('create_storage_policy', {
        bucket_name: 'soarkite',
        policy_name: 'authenticated_access',
        definition: `(role() = 'authenticated' AND auth.uid() = owner) OR bucket_id = 'soarkite'`
      });
    }

    // Update bucket public access
    await supabase.storage.updateBucket('soarkite', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
      fileSizeLimit: 5242880
    });

    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    return false;
  }
};