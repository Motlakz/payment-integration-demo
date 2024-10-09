'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

interface FormData {
  email: string;
  password: string;
}
export async function login(data: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: true };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signInWithGithub() {
  const supabase = createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `https://payment-integration-demo.vercel.app/auth/callback`,
    },
  });
  if (data.url) {
    redirect(data.url);
  }
}

export async function loginAnonymously() {
  const supabase = createClient();
  
  // Step 1: Sign in anonymously
  const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();

  if (signInError) {
    console.error('Anonymous sign-in error:', signInError);
    return { error: signInError.message };
  }

  // Step 2: Check if the user is actually signed in
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError || !user) {
    console.error('Get user error:', getUserError);
    return { error: getUserError?.message || 'Failed to authenticate user' };
  }

  // If we reach here, the user is successfully logged in
  revalidatePath('/', 'layout');
  return { success: true };
}
