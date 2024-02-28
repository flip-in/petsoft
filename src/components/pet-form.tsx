'use client';

import { usePetContext } from '@/lib/hooks';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import PetFormBtn from './pet-form-btn';

type PetFormProps = {
  actionType: 'add' | 'edit';
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  return (
    <form
      action={async (formData) => {
        onFormSubmission();

        const petData = {
          name: formData.get('name') as string,
          imageUrl:
            (formData.get('imageUrl') as string) ||
            'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
          age: parseInt(formData.get('age') as string),
          notes: formData.get('notes') as string,
          ownerName: formData.get('ownerName') as string,
        };
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

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
