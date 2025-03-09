import 'server-only';
import { redirect } from 'next/navigation'
import { createClient } from './server';

export async function getUserInfo() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      redirect('/auth/sign-in')
    }
  
    return data.user;
    
}