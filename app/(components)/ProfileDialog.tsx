//-| File path: app/(components)/ProfileDialog.tsx
"use client";

import {
  useDeleteAccount,
  useUpdateProfile,
} from "@/app/(components)/ProfileDialog.hooks";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataCyAttributes } from "@/types/cypress.types";
import { format } from "date-fns";
import { ChevronDown, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  shareConversations: boolean;
}

const ProfileDialog = () => {
  const { ui, closeProfileModal } = useAppStore();
  const { profile } = useAuthStore();
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    shareConversations: false,
  });
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  useEffect(() => {
    if (profile)
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        company: profile.company || "",
        shareConversations: profile.shareConversations || false,
      });
    if (!profile)
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        company: "",
        shareConversations: false,
      });
  }, [profile]);

  const handleInputChange = (field: keyof ProfileFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        phone: profile.phone || "",
        company: profile.company || "",
        shareConversations: profile.shareConversations || false,
      });
    }
    setDeleteConfirmText("");
    closeProfileModal();
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "delete my account") {
      deleteAccount(undefined, {
        onSuccess: () => {
          closeProfileModal();
        },
      });
    }
  };

  const hasChanges =
    profile &&
    (formData.firstName !== (profile.firstName || "") ||
      formData.lastName !== (profile.lastName || "") ||
      formData.phone !== (profile.phone || "") ||
      formData.company !== (profile.company || "") ||
      formData.shareConversations !== (profile.shareConversations || false));

  const isDeleteConfirmValid = deleteConfirmText === "delete my account";

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

            <div className="flex items-center space-x-2">
              <Switch
                id="shareConversations"
                checked={formData.shareConversations}
                onCheckedChange={(checked) =>
                  handleInputChange("shareConversations", !!checked)
                }
                data-cy={DataCyAttributes.PROFILE_SHARE_CONVERSATIONS_SWITCH}
              />
              <Label htmlFor="shareConversations" className="text-sm font-medium">
                Share content on live streams
              </Label>
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

          <div className="space-y-4">
            <div className="border-t border-gray-200 pt-4">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded w-full flex items-center justify-between"
                    data-cy={DataCyAttributes.PROFILE_DELETE_ACCOUNT_BUTTON}
                  >
                    <span className="flex items-center">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-2 border-red-300 rounded-lg p-4 bg-black text-white space-y-4 mt-4">
                    <div className="text-sm">
                      <p className="font-semibold text-white mb-2">
                        Type `delete my account` to confirm:
                      </p>
                      <ul className="text-gray-300 space-y-1 text-xs">
                        <li>
                          • Your personal information (name, email, phone,
                          profile photo) will be permanently removed
                        </li>
                        <li>
                          • You will no longer be able to log in or access your
                          account
                        </li>
                        <li>
                          • Your contracts, payments, and business
                          communications will be preserved as anonymous records
                          for legal and financial compliance
                        </li>
                        <li>• This action cannot be undone</li>
                      </ul>
                    </div>

                    <Input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type 'delete my account' to confirm"
                      className="rounded bg-black border-gray-600 text-white placeholder-gray-400"
                      data-cy={DataCyAttributes.PROFILE_DELETE_CONFIRM_INPUT}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={!isDeleteConfirmValid || isDeleting}
                      className="rounded w-full"
                      data-cy={DataCyAttributes.PROFILE_DELETE_CONFIRM_BUTTON}
                    >
                      {isDeleting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Deleting Account...
                        </div>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Confirm Delete Account
                        </>
                      )}
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
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
