"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WalkthroughConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const WalkthroughConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: WalkthroughConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Walkthrough?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to end the walkthrough? Your progress will be
            saved and you can restart the tour anytime from the help menu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Continue Tour</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>End Walkthrough</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};