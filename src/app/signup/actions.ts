'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getPaddleInstance } from '@/utils/paddle/get-paddle-instance';

interface FormData {
  email: string;
  password: string;
}

export async function signup(data: FormData) {
  const supabase = createClient();
  const paddle = getPaddleInstance();

  // Sign up the user
  const { data: userData, error: signupError } = await supabase.auth.signUp(data);

  if (signupError) {
    console.error('Signup error:', signupError);
    return { error: true };
  }

  const user = userData?.user;
  if (!user) {
    console.error('User is undefined after signup');
    return { error: true };
  }

  // Try to get or create a customer in Paddle
  let paddleCustomerId = '';
  try {
    // Attempt to create a new customer
    const customerResponse = await paddle.customers.create({
      email: data.email,
      // Add other customer details if necessary
    });
    paddleCustomerId = customerResponse.id; // Assuming the response contains the customer ID
  } catch (createError: any) {
    // If the customer already exists, the create call will fail
    if (createError.code === 'customer_already_exists') {
      // Extract the existing customer ID from the error detail
      const existingCustomerId = createError.detail.match(/id (\w+)/);
      if (existingCustomerId && existingCustomerId[1]) {
        paddleCustomerId = existingCustomerId[1];
      } else {
        console.error('Failed to extract existing customer ID from error detail');
        return { error: true };
      }
    } else {
      // If it's a different error, rethrow it
      console.error('Error creating Paddle customer:', createError);
      return { error: true };
    }
  }

  // Insert or update the customer data in the customers table
  const { error: upsertError } = await supabase
    .from('customers')
    .upsert(
      { customer_id: user.id, email: data.email, paddle_customer_id: paddleCustomerId },
      { onConflict: 'customer_id' }
    );

  if (upsertError) {
    console.error('Error upserting customer data:', upsertError);
    return { error: true };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
