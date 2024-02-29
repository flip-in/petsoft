'use client';

import { usePetContext } from '@/lib/hooks';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import PetFormBtn from './pet-form-btn';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PetFormSchema, TPetForm } from '@/lib/validations';

type PetFormProps = {
  actionType: 'add' | 'edit';
  onFormSubmission: () => void;
};

//none of the transformations (even .trim and .coerce) will occur with server actions and getValues() will return the original data
//NOTE: The above statement is incorrect. The transformations will through validations on the server. The getValues() will return the original data, but the data that is sent to the server will be transformed.

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    mode: 'onBlur',
    resolver: zodResolver(PetFormSchema),
    defaultValues:
      actionType === 'edit'
        ? {
            name: selectedPet?.name,
            ownerName: selectedPet?.ownerName,
            imageUrl: selectedPet?.imageUrl,
            age: selectedPet?.age,
            notes: selectedPet?.notes,
          }
        : undefined,
  });

  return (
    <form
      action={async () => {
        const result = await trigger();
        //needed to trigger validation without using a submithandler
        if (!result) return;

        onFormSubmission();

        const petData = getValues();
        // petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE;
        // this is needed if not validating on the server

        if (actionType === 'add') {
          await handleAddPet(petData);
        } else if (actionType === 'edit' && selectedPet) {
          await handleEditPet(selectedPet.id, petData);
        }
      }}
      className='flex flex-col'
    >
      <div className='space-y-3'>
        <div className='space-y-1'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' {...register('name')} />
          {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='ownerName'>Owner Name</Label>
          <Input id='ownerName' {...register('ownerName')} />
          {errors.ownerName && (
            <p className='text-red-500'>{errors.ownerName.message}</p>
          )}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='imageUrl'>Image Url</Label>
          <Input id='imageUrl' {...register('imageUrl')} />
          {errors.imageUrl && (
            <p className='text-red-500'>{errors.imageUrl.message}</p>
          )}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='age'>Age</Label>
          <Input id='age' {...register('age')} />
          {errors.age && <p className='text-red-500'>{errors.age.message}</p>}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='notes'>Notes</Label>
          <Textarea {...register('notes')} id='notes' />
          {errors.notes && (
            <p className='text-red-500'>{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
