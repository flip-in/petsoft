'use client';

import { usePetContext } from '@/lib/hooks';
import Image from 'next/image';
import PetButton from './pet-button';
import { Pet } from '@prisma/client';

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  return (
    <section className='flex flex-col w-full h-full'>
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <TopBar pet={selectedPet} />
          <OtherInfo pet={selectedPet} />
          <Notes pet={selectedPet} />
        </>
      )}
    </section>
  );
}

type Props = {
  pet: Pet;
};

function TopBar({ pet }: Props) {
  const { handleCheckoutPet } = usePetContext();

  return (
    <div className='flex items-center bg-white px-8 py-5 border-b border-light'>
      <Image
        src={pet.imageUrl}
        alt='Selected pet image'
        width={75}
        height={75}
        className='h-[75px] w-[75px] rounded-full object-cover'
      />

      <h2 className='text-3xl font-semibold leading-7 ml-5'>{pet.name}</h2>
      <div className='ml-auto flex space-x-2'>
        <PetButton actionType='edit'>Edit</PetButton>
        <PetButton
          onClick={async () => await handleCheckoutPet(pet.id)}
          actionType='checkout'
        >
          Checkout
        </PetButton>
      </div>
    </div>
  );
}

function OtherInfo({ pet }: Props) {
  return (
    <div className='flex justify-around py-10 px-5 text-center'>
      <div>
        <h3 className='text-[13px] font-medium uppercase text-zinc-700'>
          Owner Name
        </h3>
        <p className='mb-1 text-lg text-zinc-800'>{pet.ownerName}</p>
      </div>

      <div>
        <h3 className='text-[13px] font-medium uppercase text-zinc-700'>Age</h3>
        <p className='mb-1 text-lg text-zing-800'>{pet.age}</p>
      </div>
    </div>
  );
}

function Notes({ pet }: Props) {
  return (
    <section className='bg-white px-7 py-4 rounded-md mb-9 mx-8 flex-1 border border-light'>
      {pet.notes}
    </section>
  );
}

function EmptyView() {
  return (
    <p className='text-2xl font-medium h-full flex justify-center items-center'>
      No Pet Selected
    </p>
  );
}
