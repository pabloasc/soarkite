import { cache } from 'react';
import { UserRole } from '@prisma/client';
import { createClient } from './client';

interface userInfo {
    id: string,
    name: string,
    email: string,
    role: UserRole,
    image_url?: string
  }

// React Cache: https://react.dev/reference/react/cache
// Caches the session retrieval operation. This helps in minimizing redundant calls
// across server components for the same session data.
async function getSessionUser() {
  const supabase = createClient();
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export const getSession = cache(getSessionUser);

// Caches the user information retrieval operation. Similar to getSession,
// this minimizes redundant data fetching across components for the same user data.
export const getUserInfo = cache(async () => {
  const supabase = createClient();
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from('users')
      .select('id, name, email, role, image_url')
      .eq('id', user?.id)
      .single();

    return data as unknown as userInfo;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
});