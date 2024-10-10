'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { login, loginAnonymously } from '@/app/login/actions';
import { useState } from 'react';
import { AuthenticationForm } from '@/components/authentication/authentication-form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleLogin() {
    if (!email || !password) {
      toast({ description: 'Please enter both email and password', variant: 'destructive' });
      return;
    }
  
    setIsLoading(true);
    login({ email, password })
      .then((data) => {
        if (data?.error) {
          toast({ description: data.error || 'An error occurred during login', variant: 'destructive' });
        } else {
          // Optionally, you can add a success toast here
          toast({ description: 'Login successful!', variant: 'default' });
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        toast({ description: 'Network error occurred. Please try again.', variant: 'destructive' });
      })
      .finally(() => setIsLoading(false));
  }

  function handleAnonymousLogin() {
    setIsLoading(true);
    console.log('Starting anonymous login...');
    loginAnonymously()
      .then((data) => {
        console.log('Anonymous login response:', data);
        if (data?.error) {
          toast({ description: data.error || 'An error occurred during anonymous login', variant: 'destructive' });
        } else if (data?.success) {
          toast({ description: 'Anonymous login successful', variant: 'default' });
          router.push('/dashboard'); // Redirect to home page or dashboard
        } else {
          toast({ description: 'Unexpected response from server', variant: 'destructive' });
        }
      })
      .catch((error) => {
        console.error('Anonymous login error:', error);
        toast({ description: 'Network error occurred. Please try again.', variant: 'destructive' });
      })
      .finally(() => {
        console.log('Anonymous login process completed');
        setIsLoading(false);
      });
  }

  return (
    <form action={'#'} className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}>
      <Image src={'/assets/icons/logo/aeroedit-icon.svg'} alt={'AeroEdit'} width={80} height={80} />
      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center'}>
        Log in to your account
      </div>
      <Button 
        onClick={handleLogin} // Change from formAction to onClick
        type={'submit'} 
        variant={'secondary'} 
        className={'w-full'}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
      <div className={'flex w-full items-center justify-center'}>
        <Separator className={'w-5/12 bg-border'} />
        <div className={'text-border text-xs font-medium px-4'}>or</div>
        <Separator className={'w-5/12 bg-border'} />
      </div>
      <AuthenticationForm
        email={email}
        onEmailChange={(email) => setEmail(email)}
        password={password}
        onPasswordChange={(password) => setPassword(password)}
      />
      <Button 
        formAction={() => handleLogin()} 
        type={'submit'} 
        variant={'secondary'} 
        className={'w-full'}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  );
}
