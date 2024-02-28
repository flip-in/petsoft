// import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';

type PetFormBtnProps = {
  actionType: 'add' | 'edit';
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  // const { pending } = useFormStatus();
  // This was used before we implemented optimistic updates. It needed to be its own component because useFormStatus requires the component to be a child of a form
  return (
    <Button type='submit' className='mt-5 ml-auto'>
      {actionType === 'add' ? 'Add Pet' : 'Save Changes'}
    </Button>
  );
}
