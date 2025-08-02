//-| File path: app/(components)/OnboardingDialog.tsx
"use client";

import { useSignOutMutation } from "@/app/(components)/Sidebar.hooks";
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
import { Progress } from "@/components/ui/progress";
import { DataCyAttributes } from "@/types/cypress.types";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  LogOut,
  Mail,
  RefreshCw,
  Save,
} from "lucide-react";
import { useState } from "react";
import {
  useResendVerificationEmail,
  useSaveOnboardingData,
  useVerifyAccount,
} from "./OnboardingDialog.hooks";

interface OnboardingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
}

const OnboardingDialog = () => {
  const { isVerified, user } = useAuthStore();
  const { ui, closeOnboardingModal } = useAppStore();
  const isTest = useIsTest();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
  });

  const { mutate: saveOnboardingData, isPending } = useSaveOnboardingData();
  const { mutate: resendEmail, isPending: isResendingEmail } =
    useResendVerificationEmail();
  const { mutate: signOut, isPending: isSigningOut } = useSignOutMutation();
  const { mutate: verifyAccount, isPending: isVerifyingAccount } =
    useVerifyAccount();

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (
    field: keyof OnboardingFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    saveOnboardingData(formData, {
      onSuccess: () => {
        closeOnboardingModal();
      },
    });
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      company: "",
    });
    closeOnboardingModal();
  };

  const handleResendEmail = () => {
    resendEmail();
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleVerifyAccount = () => {
    verifyAccount();
  };

  const renderVerifyPage = () => {
    return (
      <div className="flex flex-col items-center space-y-6 py-8">
        <Mail className="w-16 h-16 text-blue-500" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Verify Your Email</h3>
          <p className="text-sm text-gray-600">
            Please check your email and click the verification link to continue.
          </p>
        </div>
        <div className="flex flex-col space-y-3 w-full">
          <Button
            onClick={handleResendEmail}
            disabled={isResendingEmail}
            className="w-full rounded"
            data-cy={DataCyAttributes.RESEND_EMAIL_BUTTON}
          >
            {isResendingEmail ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Sending...
              </div>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Email
              </>
            )}
          </Button>
          {isTest && (
            <Button
              onClick={handleVerifyAccount}
              disabled={isVerifyingAccount}
              className="w-full rounded"
              data-cy={DataCyAttributes.VERIFY_ACCOUNT_BUTTON}
            >
              {isVerifyingAccount ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Verifying...
                </div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Account
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full rounded"
            data-cy={DataCyAttributes.SIGN_OUT_VERIFY_BUTTON}
          >
            {isSigningOut ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent mr-2" />
                Signing out...
              </div>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter your first name"
                className="rounded"
                data-cy={DataCyAttributes.ONBOARDING_FIRST_NAME_INPUT}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter your last name"
                className="rounded"
                data-cy={DataCyAttributes.ONBOARDING_LAST_NAME_INPUT}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Enter your company name"
                className="rounded"
                data-cy={DataCyAttributes.ONBOARDING_COMPANY_INPUT}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="rounded"
                data-cy={DataCyAttributes.ONBOARDING_PHONE_INPUT}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const showVerifyPage = user && !isVerified;

  return (
    <Dialog
      open={!!user && (ui.onboardingModal.isOpen || !!showVerifyPage)}
      onOpenChange={handleClose}
    >
      <DialogContent
        className="max-w-md"
        data-cy={DataCyAttributes.ONBOARDING_DIALOG}
      >
        <DialogHeader>
          <DialogTitle>
            {showVerifyPage ? "Verify Your Email" : "Complete Your Profile"}
          </DialogTitle>
        </DialogHeader>

        {showVerifyPage ? (
          renderVerifyPage()
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Step {currentStep} of {totalSteps}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="min-h-[200px]">{renderStep()}</div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="rounded"
                data-cy={DataCyAttributes.ONBOARDING_BACK_BUTTON}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="rounded"
                  data-cy={DataCyAttributes.ONBOARDING_SAVE_BUTTON}
                >
                  {isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isVerified}
                  className="rounded"
                  data-cy={DataCyAttributes.ONBOARDING_NEXT_BUTTON}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
