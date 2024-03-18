'use server'
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sleep } from '@/lib/utils';
import { PetFormSchema, PetIdSchema, authSchema } from '@/lib/validations';
import { signIn, signOut } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { checkAuth, getPetById } from '@/lib/server-utils';
import { Prisma } from '@prisma/client';
import { AuthError } from 'next-auth';

// --- user actions ---

export async function logIn(prevState: unknown, formData: unknown) {
  //not necessary to convert to javascript object first. can just pass formData directly to the signIn function, however formData is unknown type and needs to be validated first
  //check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid credentials."
    }
  }
  try {
    await signIn('credentials', formData)

  } catch(error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            message: "Invalid credentials."
          }
        }
        default: {
          return {
            message: "Error. Could not sign in."
          }
        }
      }
    }
    throw error; //nextjs redirect throws error, so we need to re-throw it
  }

}

export async function signUp(prevState: unknown, formData: unknown) {
  await sleep(1000)
  //check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid credentials."
    }
  }
  // convert formData to javascript object
  const formDataEntries = Object.fromEntries(formData.entries())

  //validate the object
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid credentials."
    }
  }

  const {email, password} = validatedFormData.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword
      }
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          message: "User already exists."
        }
      }
    }
    return {
      message: "Could not create user."
    }
  }

  await signIn('credentials', formData)
}


export async function logOut() {
  await sleep(1000);

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

