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
  const { handleAddPet } = usePetContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');

    const formData = new FormData(e.currentTarget);
    const newPet = {
      name: formData.get('name') as string,
      ownerName: formData.get('ownerName') as string,
      imageUrl:
        (formData.get('imageUrl') as string) ||
        'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
      age: +(formData.get('age') as string),
      notes: formData.get('notes') as string,
    };
    handleAddPet(newPet);
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
          />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='imageUrl'>Image Url</Label>
          <Input
            name='imageUrl'
            id='imageUrl'
            type='text'
            placeholder='Enter image url'
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
          />
        </div>
      </div>

      <Button type='submit' className='mt-5 ml-auto'>
        {actionType === 'add' ? 'Add Pet' : 'Save Changes'}
      </Button>
    </form>
  );
}