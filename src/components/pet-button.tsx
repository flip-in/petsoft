import { PlusIcon } from '@radix-ui/react-icons';
import { Button, ButtonProps } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import PetForm from './pet-form';

type PetButtonProps = ButtonProps & {
  actionType: 'add' | 'edit' | 'checkout';
  children?: React.ReactNode;
};

export default function PetButton({
  children,
  actionType,
  ...props
}: PetButtonProps) {
  if (actionType === 'checkout') {
    return (
      <Button {...props} variant='secondary'>
        {children}
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {actionType === 'add' ? (
          <Button {...props} size='icon'>
            <PlusIcon className='w-6 h-6' />
          </Button>
        ) : (
          <Button {...props} variant='secondary'>
            {children}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'add' ? 'Add a new pet' : 'Edit pet details'}
          </DialogTitle>
        </DialogHeader>
        <PetForm actionType={actionType} />
      </DialogContent>
    </Dialog>
  );
}
