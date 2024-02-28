'use client';

import { usePetContext } from '@/lib/hooks';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type PetFormProps = {
  actionType: 'add' | 'edit';
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet, handleEditPet, selectedPet } = usePetContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');

    const formData = new FormData(e.currentTarget);
    const pet = {
      name: formData.get('name') as string,
      ownerName: formData.get('ownerName') as string,
      imageUrl:
        (formData.get('imageUrl') as string) ||
        'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
      age: +(formData.get('age') as string),
      notes: formData.get('notes') as string,
    };

    if (actionType === 'edit' && selectedPet) {
      handleEditPet(selectedPet.id, pet);
    } else if (actionType === 'add') {
      handleAddPet(pet);
    }

    onFormSubmission();
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col'>
      <div className='space-y-3'>
        <div className='space-y-1'>
          <Label htmlFor='name'>Name</Label>
          <Input
            name='name'
            id='name'
            type='text'
            placeholder='Enter pet name'
            required
            defaultValue={actionType === 'edit' ? selectedPet?.name : ''}
          />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='ownerName'>Owner Name</Label>
          <Input
            name='ownerName'
            id='ownerName'
            type='text'
            placeholder='Enter owner name'
            required
            defaultValue={actionType === 'edit' ? selectedPet?.ownerName : ''}
          />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='imageUrl'>Image Url</Label>
          <Input
            name='imageUrl'
            id='imageUrl'
            type='text'
            placeholder='Enter image url'
            defaultValue={actionType === 'edit' ? selectedPet?.imageUrl : ''}
          />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='age'>Age</Label>
          <Input
            name='age'
            id='age'
            type='number'
            placeholder='Enter pet age'
            required
            defaultValue={actionType === 'edit' ? selectedPet?.age : ''}
          />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='notes'>Notes</Label>
          <Textarea
            name='notes'
            id='notes'
            placeholder='Enter pet notes'
            rows={3}
            required
            defaultValue={actionType === 'edit' ? selectedPet?.notes : ''}
          />
        </div>
      </div>

      <Button type='submit' className='mt-5 ml-auto'>
        {actionType === 'add' ? 'Add Pet' : 'Save Changes'}
      </Button>
    </form>
  );
}
