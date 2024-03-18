import { logIn, signUp } from '@/actions/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type AuthFormProps = {
  type: 'signUp' | 'logIn';
};

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form action={type === 'logIn' ? logIn : signUp}>
      <div className='space-y-1'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' type='email' name='email' required maxLength={100} />
      </div>
      <div className='space-y-1 mb-4 mt-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          name='password'
          required
          maxLength={100}
        />
      </div>
      <Button type='submit'>{type === 'signUp' ? 'Sign up' : 'Log in'}</Button>
    </form>
  );
}
