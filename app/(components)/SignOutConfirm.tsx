//-| File path: app/(components)/SignOutConfirm.tsx
"use client";

import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataCyAttributes } from "@/types/cypress.types";
import { useSignOut } from "./SignOutConfirm.hooks";

interface SignOutConfirmProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignOutConfirm = ({ isOpen, onClose }: SignOutConfirmProps) => {
  const signOutMutation = useSignOut();

  const handleSignOut = () => {
    signOutMutation.mutate();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent data-cy={DataCyAttributes.SIGN_OUT_CONFIRM_DIALOG}>
        <DialogHeader>
          <DialogTitle data-cy={DataCyAttributes.SIGN_OUT_CONFIRM_TITLE}>
            Sign Out
          </DialogTitle>
          <DialogDescription data-cy={DataCyAttributes.SIGN_OUT_CONFIRM_DESCRIPTION}>
            Are you sure you want to sign out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-cy={DataCyAttributes.SIGN_OUT_CANCEL_BUTTON}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={signOutMutation.isPending}
            data-cy={DataCyAttributes.SIGN_OUT_CONFIRM_BUTTON}
          >
            {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutConfirm;
