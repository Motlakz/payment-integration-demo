'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

interface FormData {
  email: string;
  password: string;
}

export async function signup(data: FormData) {
  const supabase = createClient();
  console.log('Attempting signup with email:', data.email);
  
  const { data: signupData, error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { error: error.message };
  }

  console.log('Signup successful:', signupData);
  revalidatePath('/', 'layout');
  redirect('/');
}