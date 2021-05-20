import React from 'react';
import AlertDialog, {
  AlertDialogProps,
} from 'components/molecules/AlertDialog';

export const useAlertDialog = ({
  ...props
}: Omit<AlertDialogProps, 'isOpen' | 'setIsOpen'>): [
  React.ReactNode,
  () => void,
  () => void
] => {
  const [open, setOpen] = React.useState(false);

  const alert = <AlertDialog {...props} isOpen={open} setIsOpen={setOpen} />;
  return [
    alert,
    () => {
      setOpen(true);
    },
    () => {
      setOpen(false);
    },
  ];
};
