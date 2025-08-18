//-| File path: app/(components)/AuthDialog.tsx
"use client";

import useIsTest from "@/app/(hooks)/useIsTest";
import { useAuthStore } from "@/app/(stores)/auth.store";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/tailwind.utils";
import { sourceCodePro } from "@/styles/fonts";
import { DataCyAttributes } from "@/types/cypress.types";
import { Eye, EyeOff, Info, Loader2, Rocket, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDeleteAccount, useForgotPassword, useSignIn, useSignUp } from "./AuthDialog.hooks";

interface AuthCredentials {
  email: string;
  password: string;
}

const AuthDialog = () => {
  const { user } = useAuthStore();
  const { ui, closeAuthModal } = useAppStore();
  const isTest = useIsTest();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<AuthCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email: string | null;
    password: string | null;
  }>({
    email: null,
    password: null,
  });
  const [tooltipOpen, setTooltipOpen] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });
  const tooltipTimeouts = useRef<{
    email?: NodeJS.Timeout;
    password?: NodeJS.Timeout;
  }>({});

  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const deleteAccountMutation = useDeleteAccount();
  const forgotPasswordMutation = useForgotPassword();

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

  useEffect(() => {
    if (user)
      setFormData({
        email: "",
        password: "",
      });
  }, [user]);

  useEffect(() => {
    Object.entries(tooltipOpen).forEach(([field, isOpen]) => {
      const fieldKey = field as keyof typeof tooltipOpen;

      if (isOpen) {
        if (tooltipTimeouts.current[fieldKey]) {
          clearTimeout(tooltipTimeouts.current[fieldKey]);
        }

        tooltipTimeouts.current[fieldKey] = setTimeout(() => {
          setTooltipOpen((prev) => ({
            ...prev,
            [field]: false,
          }));
          delete tooltipTimeouts.current[fieldKey];
        }, 5000);
      } else {
        if (tooltipTimeouts.current[fieldKey]) {
          clearTimeout(tooltipTimeouts.current[fieldKey]);
          delete tooltipTimeouts.current[fieldKey];
        }
      }
    });

    return () => {
      Object.values(tooltipTimeouts.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
      tooltipTimeouts.current = {};
    };
  }, [tooltipOpen]);

  // Validation functions
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/\d/.test(password))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain at least one symbol";
    return null;
  };

  const handleInputChange = (field: keyof AuthCredentials, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }

    // Close tooltip when user starts typing
    if (tooltipOpen[field]) {
      setTooltipOpen((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const handleInputBlur = (field: keyof AuthCredentials) => {
    // Validate on blur
    const value = formData[field];
    let error: string | null = null;

    if (field === "email") {
      error = validateEmail(value);
    } else if (field === "password") {
      error = validatePassword(value);
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    // Set tooltip open based on validation result
    setTooltipOpen((prev) => ({
      ...prev,
      [field]: !!error,
    }));
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleDeleteAccount = () => {
    if (formData.email) {
      deleteAccountMutation.mutate(formData.email);
    }
  };

  const handleForgotPassword = () => {
    if (formData.email && !validateEmail(formData.email)) {
      forgotPasswordMutation.mutate(formData.email);
    }
  };

  const isPending = signInMutation.isPending || signUpMutation.isPending;

  // Check if form is valid
  const isFormValid =
    !validateEmail(formData.email) &&
    !validatePassword(formData.password) &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "";

  return (
    <Dialog open={ui.authModal.isOpen} onOpenChange={() => closeAuthModal()}>
      <DialogContent
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-[1px]"
        style={{
          borderRadius: ".5rem",
        }}
        data-cy={DataCyAttributes.AUTH_DIALOG}
      >
        <div
          className="bg-black border-transparent p-5 px-6"
          style={{
            borderRadius: ".5rem",
          }}
        >
          <DialogHeader>
            <DialogTitle>{isSignUp ? "Create Account" : "Sign In"}</DialogTitle>
          </DialogHeader>

          <TooltipProvider>
            <form onSubmit={handleSubmit} className="space-y-5 my-2">
              <div>
                <div className="flex items-center gap-2 mt-6 mb-3">
                  <Label htmlFor="email">Email</Label>
                  <Tooltip
                    onOpenChange={() =>
                      setTooltipOpen((prev) => ({
                        ...prev,
                        email: !prev.email,
                      }))
                    }
                    open={tooltipOpen.email}
                  >
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Please enter a valid email address</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleInputBlur("email")}
                  placeholder="email@example.com"
                  className={`rounded ${fieldErrors.email ? "border-red-500" : ""}`}
                  data-cy={DataCyAttributes.AUTH_EMAIL_INPUT}
                  required
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mt-6 mb-3">
                  <Label htmlFor="password">Password</Label>
                  <Tooltip
                    onOpenChange={() =>
                      setTooltipOpen((prev) => ({
                        ...prev,
                        password: !prev.password,
                      }))
                    }
                    open={tooltipOpen.password}
                  >
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <p>Password requirements:</p>
                        <ul className="list-disc list-inside mt-1">
                          <li>At least 8 characters</li>
                          <li>At least one number</li>
                          <li>At least one symbol</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onBlur={() => handleInputBlur("password")}
                    placeholder="Password"
                    className={`rounded pr-10 ${fieldErrors.password ? "border-red-500" : ""}`}
                    data-cy={DataCyAttributes.AUTH_PASSWORD_INPUT}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <div
                  className={`rounded group ${isFormValid ? "bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50 p-[1px]" : ""} ${isFormValid && !isPending ? "hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]" : ""}`}
                >
                  <Button
                    type="submit"
                    className={cn(
                      "w-full rounded font-normal relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed text-lg border border-transparent transition-all",
                      isFormValid &&
                        "text-white bg-black/70 hover:bg-black/50",

                      sourceCodePro.className
                    )}
                    disabled={isPending || !isFormValid}
                    data-cy={DataCyAttributes.AUTH_SUBMIT_BUTTON}
                  >
                    <span className="flex items-center justify-center gap-2 transition-all duration-300 uppercase">
                      {isPending
                        ? isSignUp
                          ? "Creating account..."
                          : "Signing in..."
                        : isSignUp
                          ? "Create Account"
                          : "Sign In"}
                      {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        isFormValid && (
                          <Rocket className="w-5 h-5 opacity-100 translate-x-0 group-hover:scale-110 transition-all duration-300" />
                        )
                      )}
                    </span>
                  </Button>
                </div>
              </div>

              {!isSignUp && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleForgotPassword}
                    disabled={
                      forgotPasswordMutation.isPending ||
                      !formData.email ||
                      !!validateEmail(formData.email)
                    }
                    className="text-sm rounded text-muted-foreground flex items-center justify-center gap-2"
                    data-cy={DataCyAttributes.AUTH_FORGOT_PASSWORD_BUTTON}
                  >
                    {forgotPasswordMutation.isPending && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Forgot password?
                  </Button>
                </div>
              )}

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={toggleMode}
                  className="text-sm rounded  text-muted-foreground"
                  data-cy={DataCyAttributes.AUTH_TOGGLE_MODE_BUTTON}
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </Button>
              </div>

              {isTest && !isSignUp && formData.email && (
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteAccountMutation.isPending}
                    className="w-full rounded"
                    data-cy={DataCyAttributes.AUTH_DELETE_ACCOUNT_BUTTON}
                  >
                    {deleteAccountMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Deleting...
                      </div>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
