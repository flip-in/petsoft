import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';
import { Toaster } from '@/components/ui/sonner';
import PetContextProvider from '@/contexts/pet-context-provider';
import SearchContextProvider from '@/contexts/search-context-provider';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  const pets = await prisma.pet.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <>
      <BackgroundPattern />
      <div className='flex flex-col min-h-screen max-w-[1050px] mx-auto px-4'>
        <AppHeader />

        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>

        <AppFooter />
      </div>

      <Toaster position='top-right' />
    </>
  );
}
