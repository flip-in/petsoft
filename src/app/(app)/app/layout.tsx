import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';
import PetContextProvider from '@/contexts/pet-context-provider';
import SearchContextProvider from '@/contexts/search-context-provider';
import { Pet } from '@/lib/types';
import prisma from '@/lib/db';

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const pets = await prisma.pet.findMany({});

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
    </>
  );
}
