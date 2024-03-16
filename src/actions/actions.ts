'use server'
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sleep } from '@/lib/utils';
import { PetFormSchema, PetIdSchema } from '@/lib/validations';
import { signIn, signOut } from '@/lib/auth';

// --- user actions ---

export async function logIn(formData: FormData) {
  const authData = Object.fromEntries(formData.entries())

  await signIn('credentials', authData)
}

export async function logOut() {

  await signOut({redirectTo: '/'});
}

// --- pet actions ---

export async function addPet(pet: unknown) {
  //unknown is a safer type for a backend endpoint instead of assuming the data will be the correct type
  await sleep(1000)

  const validatedPet = PetFormSchema.safeParse(pet);

  if (!validatedPet.success) {
    return {
      message: "Invalid pet data."
    }
  }

  try {

    await prisma.pet.create({
       data: validatedPet.data
    })
  } catch (error) {
    return {
      message: "Could not add pet."
    }
  }


 revalidatePath('/app', "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000)

  const validatedPetId = PetIdSchema.safeParse(petId);
  
  const validatedPet = PetFormSchema.safeParse(newPetData);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data."
    }
  }


  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data
    });
  }
  catch (error) {
    return {
      message: "Could not edit pet."
    }
  }
  revalidatePath('/app', "layout");

}

export async function deletePet(petId: unknown) {
  await sleep(1000)

  const validatedPetId = PetIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data."
    }
  }
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  }
  catch (error) {
    return {
      message: "Could not delete pet."
    }
  }
  revalidatePath('/app', "layout");
}

