import 'server-only';
import { cache } from 'react';
import { createServerSupabaseClient } from './server';

// React Cache: https://react.dev/reference/react/cache
// Caches the session retrieval operation. This helps in minimizing redundant calls
// across server components for the same session data.
async function getSessionUser() {
  const supabase = await createServerSupabaseClient();
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
  const supabase = await createServerSupabaseClient();
  // Since the CreateServerSupbaseClient is wrapped in <Database> type, the
  // query method is now typesafe.
  try {
    const { data } = await supabase
      .from('users')
      .select('*')
      .single();

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
});