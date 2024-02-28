'use server'
import { Pet } from '@/lib/types';
import prisma from '@/lib/db';

export async function addPet(formData) {
  console.log(formData)
 await prisma.pet.create({
    data: {
      name: formData.get("name"),
      imageUrl: formData.get("imageUrl") || 'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
      age: parseInt(formData.get("age")),
      notes: formData.get("notes"),
      ownerName: formData.get("ownerName"),
    }
 })
}

