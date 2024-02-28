'use server'
import { Pet } from '@/lib/types';
import prisma from '@/lib/db';

export async function addPet(pet: Omit<Pet, 'id'>) {
 await prisma.pet.create({
    data: pet
 })
}