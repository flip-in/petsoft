'use server'
import { Pet } from '@/lib/types';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sleep } from '@/lib/utils';

export async function addPet(formData) {
  await sleep(2000)
  try {

    await prisma.pet.create({
       data: {
         name: formData.get("name"),
         imageUrl: formData.get("imageUrl") || 'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
         // age: parseInt(formData.get("age")),
         notes: formData.get("notes"),
         ownerName: formData.get("ownerName"),
       }
    })
  } catch (error) {
    return {
      message: "Could not add pet."
    }
  }


 revalidatePath('/app', "layout");
}

