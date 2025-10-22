"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { toast } from "sonner";
import { Toast } from "../(components)/Toast";
import { useThemeStore } from "../layout.stores";
import { useSubmitCodeReview } from "./Footer.hooks";
import {
  CodeReviewFormData,
  FooterDataAttributes,
  RepositoryVisibility,
} from "./Footer.types";

interface CodeReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CodeReviewDialog = ({
  open,
  onOpenChange,
}: CodeReviewDialogProps) => {
  const { gradientEnabled, singleColor, gradientColors } = useThemeStore();
  const [formData, setFormData] = useState<CodeReviewFormData>({
    githubUrl: "",
    message: "",
    email: "",
    visibility: RepositoryVisibility.PUBLIC,
    hasInvitedCollaborator: false,
  });

  const [touched, setTouched] = useState({
    githubUrl: false,
    email: false,
    message: false,
  });

  const { mutate: submitReview, isPending } = useSubmitCodeReview(() => {
    onOpenChange(false);
    setFormData({
      githubUrl: "",
      message: "",
      email: "",
      visibility: RepositoryVisibility.PUBLIC,
      hasInvitedCollaborator: false,
    });
  });

  const getTextColorStyle = () => {
    if (gradientEnabled) {
      return {
        backgroundImage: `linear-gradient(to right, ${gradientColors.join(", ")})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };
    }
    return {
      color: singleColor,
    };
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText("AaronGazzola");
    toast.custom(() => (
      <Toast
        variant="success"
        title="Success"
        message="Github username `AaronGazzola` copied to clipboard"
      />
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(formData);
  };

  const isPrivate = formData.visibility === RepositoryVisibility.PRIVATE;

  const githubUrlRegex = /^https?:\/\/github\.com\/.+\/.+/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isGithubUrlValid = githubUrlRegex.test(formData.githubUrl);
  const isEmailValid = emailRegex.test(formData.email);
  const isMessageValid = formData.message.trim() !== "";

  const isFormValid =
    isGithubUrlValid &&
    isEmailValid &&
    isMessageValid &&
    (!isPrivate || formData.hasInvitedCollaborator);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-cy={FooterDataAttributes.CODE_REVIEW_DIALOG}>
        <DialogHeader className="flex flex-col gap-4 pb-4">
          <DialogTitle>Do you have a Typescript web app?</DialogTitle>
          <DialogDescription asChild>
            <div className="text-gray-50 font-medium">
              <p className="text-base"></p>
              <p className="text-base">
                Submit your github repository to apply for a free code review.
                If selected, you will get end-to-end test results and a project
                quote to refactor your web app!
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TooltipProvider>
            <div className="space-y-2">
              <Tooltip
                open={touched.githubUrl && !isGithubUrlValid ? true : undefined}
              >
                <TooltipTrigger asChild>
                  <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-destructive">
                  Please enter a valid GitHub repository URL (e.g.,
                  https://github.com/username/repo)
                </TooltipContent>
              </Tooltip>
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/username/repo"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                onBlur={() => setTouched({ ...touched, githubUrl: true })}
                required
                data-cy={FooterDataAttributes.CODE_REVIEW_GITHUB_URL_INPUT}
              />
            </div>

            <div className="space-y-2">
              <Tooltip open={touched.email && !isEmailValid ? true : undefined}>
                <TooltipTrigger asChild>
                  <Label htmlFor="email">Your Email</Label>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-destructive">
                  Please enter a valid email address
                </TooltipContent>
              </Tooltip>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={() => setTouched({ ...touched, email: true })}
                required
                data-cy={FooterDataAttributes.CODE_REVIEW_EMAIL_INPUT}
              />
            </div>

            <div className="space-y-2">
              <Tooltip
                open={touched.message && !isMessageValid ? true : undefined}
              >
                <TooltipTrigger asChild>
                  <Label htmlFor="message">Message</Label>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-destructive">
                  Please provide a message about your project
                </TooltipContent>
              </Tooltip>
              <Textarea
                id="message"
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                onBlur={() => setTouched({ ...touched, message: true })}
                rows={4}
                required
                data-cy={FooterDataAttributes.CODE_REVIEW_MESSAGE_INPUT}
              />
            </div>

            <div className="space-y-3">
              <Label>Repository Visibility</Label>
              <RadioGroup
                value={formData.visibility}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    visibility: value as RepositoryVisibility,
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={RepositoryVisibility.PUBLIC}
                    id="public"
                    data-cy={FooterDataAttributes.CODE_REVIEW_PUBLIC_RADIO}
                  />
                  <Label
                    htmlFor="public"
                    className="font-normal cursor-pointer"
                  >
                    This repository is public
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={RepositoryVisibility.PRIVATE}
                    id="private"
                    data-cy={FooterDataAttributes.CODE_REVIEW_PRIVATE_RADIO}
                  />
                  <Label
                    htmlFor="private"
                    className="font-normal cursor-pointer"
                  >
                    This repository is private
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {isPrivate && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="collaborator"
                  checked={formData.hasInvitedCollaborator}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      hasInvitedCollaborator: checked === true,
                    })
                  }
                  required={isPrivate}
                  data-cy={
                    FooterDataAttributes.CODE_REVIEW_COLLABORATOR_CHECKBOX
                  }
                />
                <Label
                  htmlFor="collaborator"
                  className="font-normal cursor-pointer text-sm"
                >
                  I have invited the GitHub user{" "}
                  <code
                    className="cursor-pointer hover:text-white transition-colors"
                    style={getTextColorStyle()}
                    onClick={handleCopyUsername}
                  >
                    AaronGazzola
                  </code>{" "}
                  as a collaborator
                </Label>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                data-cy={FooterDataAttributes.CODE_REVIEW_CANCEL_BUTTON}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                disabled={isPending || !isFormValid}
                data-cy={FooterDataAttributes.CODE_REVIEW_SUBMIT_BUTTON}
              >
                {isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </TooltipProvider>
        </form>
      </DialogContent>
    </Dialog>
  );
};
