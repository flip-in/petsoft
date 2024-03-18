'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';

export default function AuthFormBtn({ type }: { type: 'signUp' | 'logIn' }) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type='submit'>
      {type === 'signUp' ? 'Sign up' : 'Log in'}
    </Button>
  );
}
