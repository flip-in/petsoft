import ContentBlock from '@/components/content-block';
import H1 from '@/components/h1';

export default function AccountPage() {
  return (
    <main>
      <H1 className='text-white my-8'>Your Account</H1>

      <ContentBlock className='flex justify-center items-center h-[500px]'>
        <p>Logged in as ...</p>
      </ContentBlock>
    </main>
  );
}
