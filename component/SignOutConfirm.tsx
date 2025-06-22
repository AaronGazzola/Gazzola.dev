//-| File path: component/SignOutConfirm.tsx
//-| Filepath: component/SignOutConfirm.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signOut } from "@/lib/auth-client";
import { useAppStore } from "@/stores/app.store";
import { useChatStore } from "@/stores/chat.store";
import { useContractStore } from "@/stores/contract.store";

interface SignOutConfirmProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignOutConfirm = ({ isOpen, onClose }: SignOutConfirmProps) => {
  const { reset: resetApp } = useAppStore();
  const { reset: resetChat } = useChatStore();
  const { reset: resetContract } = useContractStore();

  const handleSignOut = async () => {
    resetApp();
    resetChat();
    resetContract();
    onClose();
    await signOut();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? This will clear all your local
            data and you will need to sign in again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutConfirm;
