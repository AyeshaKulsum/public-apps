import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  Button,
} from '@sparrowengg/twigs-react';

const CustomAlertModal = ({
  openAlertModal,
  setOpenAlertModal,
  title,
  description,
  actionButtonText,
  handleAction,
  loading = false,
}) => {
  return (
    <AlertDialog open={openAlertModal}>
      <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <AlertDialogActions>
          <AlertDialogCancel asChild>
            <Button
              color="default"
              size="lg"
              onClick={() => setOpenAlertModal(false)}
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              color="error"
              size="lg"
              onClick={handleAction}
              loading={loading}
            >
              {actionButtonText}
            </Button>
          </AlertDialogAction>
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertModal;
