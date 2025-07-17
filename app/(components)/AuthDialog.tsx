//-| File path: app/(components)/AuthDialog.tsx
"use client";

import { useAppStore } from "@/app/(stores)/ui.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataCyAttributes } from "@/types/cypress.types";
import { useState } from "react";
import { useSignIn, useSignUp } from "./AuthDialog.hooks";

interface AuthCredentials {
  email: string;
  password: string;
}

const AuthDialog = () => {
  const { ui, closeAuthModal } = useAppStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<AuthCredentials>({
    email: "",
    password: "",
  });

  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp)
      return signUpMutation.mutate({
        email: formData.email,
        password: formData.password,
        name: formData.email.split("@")[0],
      });

    signInMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleInputChange = (field: keyof AuthCredentials, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const isPending = signInMutation.isPending || signUpMutation.isPending;

  return (
    <Dialog open={ui.authModal.isOpen} onOpenChange={() => closeAuthModal()}>
      <DialogContent className="" data-cy={DataCyAttributes.AUTH_DIALOG}>
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create Account" : "Sign In"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 my-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="email@example.com"
              className="rounded"
              data-cy={DataCyAttributes.AUTH_EMAIL_INPUT}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Password"
              className="rounded"
              data-cy={DataCyAttributes.AUTH_PASSWORD_INPUT}
              required
            />
          </div>
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full rounded border"
              disabled={isPending}
              data-cy={DataCyAttributes.AUTH_SUBMIT_BUTTON}
            >
              {isPending
                ? "Loading..."
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={toggleMode}
              className="text-sm rounded"
              data-cy={DataCyAttributes.AUTH_TOGGLE_MODE_BUTTON}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
