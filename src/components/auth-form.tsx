import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type AuthFormProps = {
  type: 'signup' | 'login';
};

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form className=''>
      <div className='space-y-1'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' type='email' />
      </div>
      <div className='space-y-1 mb-4 mt-2'>
        <Label htmlFor='password'>Password</Label>
        <Input id='password' type='password' />
      </div>
      <Button type='submit'>{type === 'signup' ? 'Sign up' : 'Log in'}</Button>
    </form>
  );
}
