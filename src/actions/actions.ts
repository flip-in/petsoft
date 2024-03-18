'use server'
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sleep } from '@/lib/utils';
import { PetFormSchema, PetIdSchema } from '@/lib/validations';
import { auth, signIn, signOut } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { checkAuth, getPetById } from '@/lib/server-utils';

// --- user actions ---

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(formData.get('password') as string, 10)

  await prisma.user.create({
    data: {
      email: formData.get('email') as string ,
      hashedPassword
    }
  })

  await signIn('credentials', formData)
}

export async function logIn(formData: FormData) {
  // const authData = Object.fromEntries(formData.entries());
  //not necessary to convert to javascript object first. can just pass formData directly to the signIn function

  await signIn('credentials', formData)
}

export async function logOut() {

  await signOut({redirectTo: '/'});
}

// --- pet actions ---

export async function addPet(pet: unknown) {
  //unknown is a safer type for a backend endpoint instead of assuming the data will be the correct type
  await sleep(1000)
  const session = await checkAuth();

  const validatedPet = PetFormSchema.safeParse(pet);

  if (!validatedPet.success) {
    return {
      message: "Invalid pet data."
    }
  }

  try {

    await prisma.pet.create({
       data: {...validatedPet.data, user: {
        connect: {
          id: session.user.id
        }
       }}
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

  //authentication check
  const session = await checkAuth();

  //validation
  const validatedPetId = PetIdSchema.safeParse(petId);
  
  const validatedPet = PetFormSchema.safeParse(newPetData);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data."
    }
  }

  //authorization check (user owns pet)
  const pet = await getPetById(validatedPetId.data);
  if(!pet) {
    return {
      message: "Pet not found."
    }
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized."
    }
  }

  //database mutation
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
  //authentication check
  const session = await checkAuth();


  //database validation
  const validatedPetId = PetIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data."
    }
  }

  //authorization check (user owns pet)
  const pet = await getPetById(validatedPetId.data);

  if(!pet) {
    return {
      message: "Pet not found."
    }
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized."
    }
  }


  //database mutation
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

