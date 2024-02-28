import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type PetFormProps = {
  actionType: 'add' | 'edit';
};

export default function PetForm({ actionType }: PetFormProps) {
  return (
    <form className='flex flex-col'>
      <div className='space-y-3'>
        <div className='space-y-1'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' type='text' placeholder='Enter pet name' />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='ownerName'>Owner Name</Label>
          <Input id='ownerName' type='text' placeholder='Enter pet name' />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='imageUrl'>Image Url</Label>
          <Input id='imageUrl' type='text' placeholder='Enter pet name' />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='age'>Age</Label>
          <Input id='age' type='number' placeholder='Enter pet name' />
        </div>
        <div className='space-y-1'>
          <Label htmlFor='notes'>Notes</Label>
          <Textarea id='notes' placeholder='Enter pet notes' rows={3} />
        </div>
      </div>

      <Button type='submit' className='mt-5 ml-auto'>
        {actionType === 'add' ? 'Add Pet' : 'Save Changes'}
      </Button>
    </form>
  );
}
