'use client';

import { addPet, deletePet, editPet } from '@/actions/actions';
import { Pet } from '@/lib/types';
import { createContext, startTransition, useOptimistic, useState } from 'react';
import { toast } from 'sonner';

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleCheckoutPet: (id: string) => Promise<void>;
  handleAddPet: (newPet: Omit<Pet, 'id'>) => Promise<void>;
  handleEditPet: (petId: string, newPetData: Omit<Pet, 'id'>) => Promise<void>;
};

export const PetContext = createContext<TPetContext | null>(null);

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  //state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (prev, { action, payload }) => {
      switch (action) {
        case 'add':
          return [...prev, { ...payload, id: Math.random().toString() }];
        case 'edit':
          return prev.map((pet) =>
            pet.id === payload.id ? { ...pet, ...payload.data } : pet
          );
        case 'delete':
          return prev.filter((pet) => pet.id !== payload);
        default:
          return prev;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  //handlers
  const handleAddPet = async (newPet: Omit<Pet, 'id'>) => {
    setOptimisticPets({ action: 'add', payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };
  const handleEditPet = async (petId: string, newPetData: Omit<Pet, 'id'>) => {
    setOptimisticPets({
      action: 'edit',
      payload: { id: petId, data: newPetData },
    });
    const error = await editPet(selectedPet!.id, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };
  const handleCheckoutPet = async (petId: string) => {
    startTransition(() => {
      setOptimisticPets({ action: 'delete', payload: petId });
    });
    await deletePet(petId);
    setSelectedPetId(null);
  };
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
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
