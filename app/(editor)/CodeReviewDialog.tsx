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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/tailwind.utils";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toast } from "../(components)/Toast";
import { useSubmitCodeReview } from "./Footer.hooks";
import {
  CodeReviewFormData,
  FooterDataAttributes,
  RepositoryVisibility,
} from "./Footer.types";

interface CodeReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean | null) => void;
}

export const CodeReviewDialog = ({
  open,
  onOpenChange,
}: CodeReviewDialogProps) => {
  const [formData, setFormData] = useState<CodeReviewFormData>({
    githubUrl: "",
    message: "",
    email: "",
    visibility: RepositoryVisibility.PUBLIC,
    hasInvitedCollaborator: false,
    agreedToTerms: false,
    allowLivestream: false,
  });

  const [touched, setTouched] = useState({
    githubUrl: false,
    email: false,
    message: false,
  });

  const [tooltipVisible, setTooltipVisible] = useState({
    githubUrl: false,
    email: false,
    message: false,
  });

  const [tooltipHovered, setTooltipHovered] = useState({
    githubUrl: false,
    email: false,
    message: false,
  });

  const [termsPopoverOpen, setTermsPopoverOpen] = useState(false);

  const { mutate: submitReview, isPending } = useSubmitCodeReview(() => {
    onOpenChange(false);
    setFormData({
      githubUrl: "",
      message: "",
      email: "",
      visibility: RepositoryVisibility.PUBLIC,
      hasInvitedCollaborator: false,
      agreedToTerms: false,
      allowLivestream: false,
    });
  });

  const handleCopyUsername = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const githubUrlRegex = /^(https?:\/\/)?(github\.com\/.+\/.+)/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isGithubUrlValid = githubUrlRegex.test(formData.githubUrl);
  const isEmailValid = emailRegex.test(formData.email);
  const isMessageValid = formData.message.trim() !== "";

  const isFormValid =
    isGithubUrlValid &&
    isEmailValid &&
    isMessageValid &&
    (!isPrivate || formData.hasInvitedCollaborator) &&
    formData.agreedToTerms;

  useEffect(() => {
    if (touched.githubUrl && !isGithubUrlValid) {
      setTooltipVisible((prev) => ({ ...prev, githubUrl: true }));
      const timer = setTimeout(() => {
        setTooltipVisible((prev) => ({ ...prev, githubUrl: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [touched.githubUrl, isGithubUrlValid]);

  useEffect(() => {
    if (touched.email && !isEmailValid) {
      setTooltipVisible((prev) => ({ ...prev, email: true }));
      const timer = setTimeout(() => {
        setTooltipVisible((prev) => ({ ...prev, email: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [touched.email, isEmailValid]);

  useEffect(() => {
    if (touched.message && !isMessageValid) {
      setTooltipVisible((prev) => ({ ...prev, message: true }));
      const timer = setTimeout(() => {
        setTooltipVisible((prev) => ({ ...prev, message: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [touched.message, isMessageValid]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-cy={FooterDataAttributes.CODE_REVIEW_DIALOG}>
        <DialogHeader className="flex flex-col gap-4 pb-4">
          <DialogTitle>Do you have a Typescript web app?</DialogTitle>
          <DialogDescription asChild>
            <div className="!text-gray-100 font-medium">
              <p className="text-base"></p>
              <p className="text-base">
                Submit your github repository to apply for a free code review.
                <br />
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
                open={
                  touched.githubUrl && !isGithubUrlValid
                    ? tooltipVisible.githubUrl || tooltipHovered.githubUrl
                    : undefined
                }
              >
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="githubUrl"
                    onMouseEnter={() =>
                      setTooltipHovered({ ...tooltipHovered, githubUrl: true })
                    }
                    onMouseLeave={() =>
                      setTooltipHovered({ ...tooltipHovered, githubUrl: false })
                    }
                  >
                    GitHub Repository URL
                  </Label>
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
                className={cn(
                  touched.githubUrl && !isGithubUrlValid && "border-destructive"
                )}
              />
            </div>

            <div className="space-y-2">
              <Tooltip
                open={
                  touched.email && !isEmailValid
                    ? tooltipVisible.email || tooltipHovered.email
                    : undefined
                }
              >
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="email"
                    onMouseEnter={() =>
                      setTooltipHovered({ ...tooltipHovered, email: true })
                    }
                    onMouseLeave={() =>
                      setTooltipHovered({ ...tooltipHovered, email: false })
                    }
                  >
                    Your Email
                  </Label>
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
                className={cn(
                  touched.email && !isEmailValid && "border-destructive"
                )}
              />
              <p className="text-xs text-muted-foreground">
                Your email will only be used for direct correspondence between
                Aaron Gazzola and you.
              </p>
            </div>

            <div className="space-y-2">
              <Tooltip
                open={
                  touched.message && !isMessageValid
                    ? tooltipVisible.message || tooltipHovered.message
                    : undefined
                }
              >
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="message"
                    onMouseEnter={() =>
                      setTooltipHovered({ ...tooltipHovered, message: true })
                    }
                    onMouseLeave={() =>
                      setTooltipHovered({ ...tooltipHovered, message: false })
                    }
                  >
                    Message
                  </Label>
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
                className={cn(
                  touched.message && !isMessageValid && "border-destructive"
                )}
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

            {!isPrivate && (
              <div className="flex items-start">
                <div className="pr-2">
                  <Checkbox
                    id="livestream"
                    checked={formData.allowLivestream}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        allowLivestream: checked === true,
                      })
                    }
                    data-cy={
                      FooterDataAttributes.CODE_REVIEW_LIVESTREAM_CHECKBOX
                    }
                  />
                </div>
                <Label
                  htmlFor="livestream"
                  className="font-normal cursor-pointer text-s"
                >
                  I consent to my code being shared on public YouTube live
                  streams and permanently available in video-on-demand
                  recordings
                </Label>
              </div>
            )}

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
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-all border-2 border-white bg-black text-white hover:bg-white hover:text-black"
                    onClick={handleCopyUsername}
                  >
                    <span className="font-bold">AaronGazzola</span>
                    <Copy className="w-3 h-3" />
                  </span>{" "}
                  as a collaborator
                </Label>
              </div>
            )}

            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    agreedToTerms: checked === true,
                  })
                }
                required
                data-cy={FooterDataAttributes.CODE_REVIEW_TERMS_CHECKBOX}
              />
              <Label
                htmlFor="terms"
                className="font-normal cursor-pointer text-sm"
              >
                I have read and agree to the{" "}
                <Popover
                  open={termsPopoverOpen}
                  onOpenChange={setTermsPopoverOpen}
                >
                  <PopoverTrigger
                    type="button"
                    className={cn(
                      "underline hover:bg-white hover:text-black rounded px-1",
                      termsPopoverOpen && "bg-white text-black"
                    )}
                    data-cy={
                      FooterDataAttributes.CODE_REVIEW_TERMS_POPOVER_TRIGGER
                    }
                  >
                    terms and conditions
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-96 max-h-96 overflow-y-auto"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">
                        Terms and Conditions
                      </h3>

                      <div className="space-y-2 text-sm">
                        <h4 className="font-semibold">
                          1. Code Review Request
                        </h4>
                        <p>
                          By submitting this form, you grant the reviewer access
                          to your GitHub repository for the purpose of
                          conducting a code review. The reviewer will assess
                          your codebase at their sole discretion.
                        </p>

                        <h4 className="font-semibold">
                          2. No Obligation to Respond
                        </h4>
                        <p>
                          The reviewer is under no obligation to provide a code
                          review or any response to your submission. Code review
                          requests are reviewed on a case-by-case basis, and
                          acceptance is not guaranteed.
                        </p>

                        <h4 className="font-semibold">
                          3. Code Review Deliverables
                        </h4>
                        <p>If selected, you will receive:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>End-to-end test results</li>
                          <li>Documentation review</li>
                          <li>Concise code review findings</li>
                          <li>
                            Fixed-price quote for refactoring, fixing, and
                            improving your repository
                          </li>
                        </ul>

                        <h4 className="font-semibold">
                          4. Development Environment
                        </h4>
                        <p>
                          The reviewer will clone your repository and use their
                          own accounts for databases and third-party API
                          services during development and testing. You are
                          responsible for ensuring your repository does not
                          contain sensitive credentials or API keys.
                        </p>

                        <h4 className="font-semibold">
                          5. Testing and Implementation Exclusions
                        </h4>
                        <p>
                          Any changes made to your repository during the review
                          process, including test suites, improvements, or
                          modifications, will not be included in the initial
                          code review deliverables.
                        </p>

                        <h4 className="font-semibold">6. Project Agreement</h4>
                        <p>
                          If you choose to proceed with the quoted refactoring
                          work, the following terms apply:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Work will be completed for the agreed fixed price
                          </li>
                          <li>No formal contract will be executed</li>
                          <li>
                            Agreement is based on mutual understanding and good
                            faith
                          </li>
                          <li>
                            Payment terms will be discussed and agreed upon
                            separately
                          </li>
                        </ul>

                        <h4 className="font-semibold">7. Code Delivery</h4>
                        <p>
                          Upon completion of the refactoring work, the reviewer
                          will offer to push all changes directly to your
                          repository for an additional fixed fee. Until payment
                          is received, all modified code remains the property of
                          the reviewer.
                        </p>

                        <h4 className="font-semibold">
                          8. Intellectual Property
                        </h4>
                        <p>
                          Your original code remains your intellectual property.
                          Any improvements or modifications made by the reviewer
                          become your property only upon full payment and
                          delivery of the final code.
                        </p>

                        <h4 className="font-semibold">
                          9. Privacy and Email Usage
                        </h4>
                        <p>
                          Your email address will only be used for direct
                          correspondence between Aaron Gazzola and you regarding
                          your code review request and any subsequent project
                          work. Your email will not be shared with third parties
                          or used for marketing purposes.
                        </p>

                        <h4 className="font-semibold">
                          10. Public Livestream Consent
                        </h4>
                        <p>
                          If you consent to livestream sharing (applicable only
                          to public repositories), you grant Aaron Gazzola
                          permission to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Share all code from your repository during live
                            YouTube streaming sessions
                          </li>
                          <li>
                            Make permanent video-on-demand (VOD) recordings
                            publicly available on YouTube
                          </li>
                          <li>
                            Discuss, analyze, and modify your code in a public
                            forum
                          </li>
                        </ul>
                        <p className="mt-2">
                          Environment variables, API keys, credentials, and
                          other sensitive configuration files will be excluded
                          from any public sharing. This consent is optional and
                          does not affect your eligibility for code review.
                        </p>

                        <h4 className="font-semibold">11. Confidentiality</h4>
                        <p>
                          For private repositories or public repositories
                          without livestream consent, the reviewer agrees to
                          maintain confidentiality of your code and will not
                          share, distribute, or use your code for any purpose
                          other than the agreed-upon review and refactoring
                          services.
                        </p>

                        <h4 className="font-semibold">12. Liability</h4>
                        <p>
                          The reviewer provides services on an
                          &ldquo;as-is&rdquo; basis and makes no warranties
                          regarding the code review or refactoring work. The
                          reviewer shall not be liable for any damages arising
                          from the use of the services or delivered code.
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </Label>
            </div>

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
