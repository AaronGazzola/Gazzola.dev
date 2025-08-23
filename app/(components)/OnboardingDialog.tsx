//-| File path: app/(components)/OnboardingDialog.tsx
"use client";

import { useSignOutMutation } from "@/app/(components)/Sidebar.hooks";
import useIsTest from "@/app/(hooks)/useIsTest";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import configuration from "@/configuration";
import { cn } from "@/lib/tailwind.utils";
import { DataCyAttributes } from "@/types/cypress.types";
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  LogOut,
  Mail,
  RefreshCw,
  Rocket,
} from "lucide-react";
import { usePathname } from "next/navigation";
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
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  shareContent: boolean;
}

const OnboardingDialog = () => {
  const { isVerified, user } = useAuthStore();
  const pathname = usePathname();
  const { ui, closeOnboardingModal } = useAppStore();
  const isTest = useIsTest();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    acceptTerms: false,
    acceptPrivacy: false,
    shareContent: false,
  });

  const { mutate: saveOnboardingData, isPending } = useSaveOnboardingData();
  const { mutate: resendEmail, isPending: isResendingEmail } =
    useResendVerificationEmail();
  const { mutate: signOut, isPending: isSigningOut } = useSignOutMutation();
  const { mutate: verifyAccount, isPending: isVerifyingAccount } =
    useVerifyAccount();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (
    field: keyof OnboardingFormData,
    value: string | boolean
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
      acceptTerms: false,
      acceptPrivacy: false,
      shareContent: false,
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("acceptTerms", !!checked)
                  }
                  data-cy={DataCyAttributes.ONBOARDING_TERMS_CHECKBOX}
                />
                <Label htmlFor="acceptTerms" className="text-sm font-medium">
                  I accept the Terms and Conditions *
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptPrivacy"
                  checked={formData.acceptPrivacy}
                  onCheckedChange={(checked) =>
                    handleInputChange("acceptPrivacy", !!checked)
                  }
                  data-cy={DataCyAttributes.ONBOARDING_PRIVACY_CHECKBOX}
                />
                <Label htmlFor="acceptPrivacy" className="text-sm font-medium">
                  I accept the Privacy Policy *
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shareContent"
                  checked={formData.shareContent}
                  onCheckedChange={(checked) =>
                    handleInputChange("shareContent", !!checked)
                  }
                  data-cy={DataCyAttributes.ONBOARDING_SHARE_CONTENT_CHECKBOX}
                />
                <Label htmlFor="shareContent" className="text-sm font-medium">
                  Share content on live streams
                </Label>
              </div>
            </div>

            <Button
              variant="link"
              onClick={() => window.open(configuration.paths.terms, "_blank")}
              className="rounded text-white"
              data-cy={DataCyAttributes.ONBOARDING_TERMS_LINK}
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              View Terms and Policies
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const showVerifyPage = user && !isVerified;
  
  const isNextButtonValid = isVerified && !(currentStep === 1 && !formData.firstName.trim());
  const isSaveButtonValid = !isPending && formData.acceptTerms && formData.acceptPrivacy;

  return (
    <Dialog
      open={
        !!user &&
        !pathname.startsWith(configuration.paths.test) &&
        (ui.onboardingModal.isOpen || !!showVerifyPage)
      }
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
            <div className="min-h-[180px] flex flex-col justify-center gap-2">
              {renderStep()}
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
            </div>

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
                <div
                  className={`rounded group ${isSaveButtonValid ? "bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50 p-[1px]" : ""} ${isSaveButtonValid && !isPending ? "hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]" : ""}`}
                >
                  <Button
                    type="button"
                    onClick={handleSave}
                    className={cn(
                      "rounded relative overflow-hidden group disabled:cursor-not-allowed border border-transparent transition-all bg-transparent",
                      isSaveButtonValid && "text-white bg-black/70 hover:bg-black/50"
                    )}
                    disabled={!isSaveButtonValid}
                    data-cy={DataCyAttributes.ONBOARDING_SAVE_BUTTON}
                  >
                    <span className="flex items-center justify-center gap-2 transition-all duration-300">
                      {isPending ? (
                        <>
                          Saving...
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        </>
                      ) : (
                        <>
                          Save
                          <Rocket className={`w-5 h-5 translate-x-0 group-hover:scale-110 transition-all duration-300 ${isSaveButtonValid ? "opacity-100" : "opacity-0"}`} />
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              ) : (
                <div
                  className={`rounded group ${isNextButtonValid ? "bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50 p-[1px]" : ""} ${isNextButtonValid ? "hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]" : ""}`}
                >
                  <Button
                    type="button"
                    onClick={handleNext}
                    className={cn(
                      "rounded relative overflow-hidden group disabled:cursor-not-allowed border border-transparent transition-all bg-transparent",
                      isNextButtonValid && "text-white bg-black/70 hover:bg-black/50"
                    )}
                    disabled={!isNextButtonValid}
                    data-cy={DataCyAttributes.ONBOARDING_NEXT_BUTTON}
                  >
                    <span className="flex items-center justify-center gap-2 transition-all duration-300">
                      Next
                      <Rocket className={`w-5 h-5 translate-x-0 group-hover:scale-110 transition-all duration-300 ${isNextButtonValid ? "opacity-100" : "opacity-0"}`} />
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
