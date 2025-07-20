//-| File path: app/(components)/ProfileDialog.tsx
"use client";

import { useUpdateProfile } from "@/app/(components)/ProfileDialog.hooks";
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
import { DataCyAttributes } from "@/types/cypress.types";
import { format } from "date-fns";
import { Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  avatar: string;
}

const ProfileDialog = () => {
  const { ui, closeProfileModal } = useAppStore();
  const { profile } = useAuthStore();
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    avatar: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        company: profile.company || "",
        avatar: profile.avatar || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      try {
        const base64 = await convertToBase64(file);
        handleInputChange("avatar", base64);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        await handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const removeAvatar = () => {
    handleInputChange("avatar", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!profile) return;

    updateProfile(
      {
        id: profile.id,
        ...formData,
      },
      {
        onSuccess: () => {
          closeProfileModal();
        },
      }
    );
  };

  const handleClose = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        company: profile.company || "",
        avatar: profile.avatar || "",
      });
    }
    closeProfileModal();
  };

  const hasChanges =
    profile &&
    (formData.firstName !== (profile.firstName || "") ||
      formData.lastName !== (profile.lastName || "") ||
      formData.email !== (profile.email || "") ||
      formData.phone !== (profile.phone || "") ||
      formData.company !== (profile.company || "") ||
      formData.avatar !== (profile.avatar || ""));

  return (
    <Dialog open={ui.profileModal.isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        data-cy={DataCyAttributes.PROFILE_DIALOG}
      >
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Avatar</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                data-cy={DataCyAttributes.PROFILE_AVATAR_UPLOAD}
              >
                {formData.avatar ? (
                  <div className="space-y-3">
                    <Image
                      src={formData.avatar}
                      alt="Avatar preview"
                      className="mx-auto w-24 h-24 rounded-full object-cover"
                      width={96}
                      height={96}
                    />
                    <div className="flex justify-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded"
                        data-cy={DataCyAttributes.PROFILE_AVATAR_CHANGE_BUTTON}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Change
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeAvatar}
                        className="rounded"
                        data-cy={DataCyAttributes.PROFILE_AVATAR_REMOVE_BUTTON}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Drop an image here or</p>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 p-0 h-auto"
                        data-cy={DataCyAttributes.PROFILE_AVATAR_BROWSE_BUTTON}
                      >
                        browse files
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter your first name"
                  className="rounded"
                  data-cy={DataCyAttributes.PROFILE_FIRST_NAME_INPUT}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter your last name"
                  className="rounded"
                  data-cy={DataCyAttributes.PROFILE_LAST_NAME_INPUT}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                className="rounded"
                data-cy={DataCyAttributes.PROFILE_EMAIL_INPUT}
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
                data-cy={DataCyAttributes.PROFILE_PHONE_INPUT}
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Enter your company name"
                className="rounded"
                data-cy={DataCyAttributes.PROFILE_COMPANY_INPUT}
              />
            </div>

            {profile && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Created:</span>{" "}
                  {format(new Date(profile.createdAt), "PPP")}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Last updated:</span>{" "}
                  {format(new Date(profile.updatedAt), "PPP")}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded"
              data-cy={DataCyAttributes.PROFILE_CANCEL_BUTTON}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending || !hasChanges}
              className="rounded"
              data-cy={DataCyAttributes.PROFILE_SAVE_BUTTON}
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
