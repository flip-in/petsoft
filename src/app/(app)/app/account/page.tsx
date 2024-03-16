import ContentBlock from '@/components/content-block';
import H1 from '@/components/h1';
import SignOutBtn from '@/components/sign-out-btn';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <main>
      <H1 className='text-white my-8'>Your Account</H1>

      <ContentBlock className='flex justify-center items-center h-[500px] flex-col gap-3'>
        <p>Logged in as {session.user.email}</p>
        <SignOutBtn />
      </ContentBlock>
    </main>
  );
}
