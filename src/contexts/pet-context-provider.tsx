'use client';

import { addPet } from '@/actions/actions';
import { Pet } from '@/lib/types';
import { createContext, useState } from 'react';

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<Pet, 'id'>) => void;
  handleEditPet: (petId: string, newPetData: Omit<Pet, 'id'>) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

export default function PetContextProvider({
  children,
  data: pets,
}: PetContextProviderProps) {
  //state

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  //handlers
  const handleAddPet = async (newPet: Omit<Pet, 'id'>) => {
    await addPet(newPet);
  };
  const handleEditPet = (petId: string, newPetData: Omit<Pet, 'id'>) => {
    setPets((prev) =>
      prev.map((pet) =>
        pet.id === petId
          ? {
              id: petId,
              ...newPetData,
            }
          : pet
      )
    );
  };
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };
  const handleCheckoutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
