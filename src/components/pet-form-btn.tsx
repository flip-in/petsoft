import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';

type PetFormBtnProps = {
  actionType: 'add' | 'edit';
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type='submit' className='mt-5 ml-auto'>
      {actionType === 'add' ? 'Add Pet' : 'Save Changes'}
    </Button>
  );
}
