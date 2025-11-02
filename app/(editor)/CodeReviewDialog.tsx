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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/tailwind.utils";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toast } from "../(components)/Toast";
import { useSubmitCodeReview } from "./Footer.hooks";
import {
  BusinessNumberType,
  CodeReviewFormData,
  FooterDataAttributes,
  RepositoryVisibility,
} from "./Footer.types";
import { downloadNDAPDF } from "./nda.utils";

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
    agreedToTerms: false,
    allowLivestream: false,
    nda: {
      legalEntityName: "",
      jurisdiction: "Victoria, Australia",
      effectiveDate: new Date().toISOString().split("T")[0],
    },
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
      agreedToTerms: false,
      allowLivestream: false,
      nda: {
        legalEntityName: "",
        jurisdiction: "Victoria, Australia",
        effectiveDate: new Date().toISOString().split("T")[0],
      },
    });
  });

  const handlePreviewNDA = () => {
    if (!formData.nda.legalEntityName) {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Missing Information"
          message="Please enter your legal entity name before previewing"
        />
      ));
      return;
    }
    downloadNDAPDF(formData.nda);
    toast.custom(() => (
      <Toast
        variant="success"
        title="NDA Downloaded"
        message="Review the NDA. It will be automatically attached to your submission."
      />
    ));
  };

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
    (!isPrivate ? isGithubUrlValid : true) &&
    isEmailValid &&
    isMessageValid &&
    formData.agreedToTerms &&
    (!isPrivate || formData.nda.legalEntityName.trim() !== "");

  useEffect(() => {
    if (touched.githubUrl && !isGithubUrlValid) {
      setTooltipVisible((prev) => ({ ...prev, githubUrl: true }));
      const timer = setTimeout(() => {
        setTooltipVisible((prev) => ({ ...prev, githubUrl: false }));
      }, 3000);
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
        <DialogHeader className="flex flex-col gap-1 pb-4">
          <DialogTitle>
            Apply for a <strong className="italic">free</strong> code review
          </DialogTitle>
          <DialogDescription asChild className="text-base">
            <div className="!text-gray-100 font-medium">
              <p className="mt-2 text-sm">You will receive:</p>
              <ul className="list-disc list-inside text-sm">
                <li>
                  Comprehensive <strong> test results</strong> from a custom
                  testing suite
                </li>
                <li>
                  A <strong>project quote </strong> to reach 100% pass rate
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TooltipProvider>
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
                <div className="space-y-2">
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
                  {formData.visibility === RepositoryVisibility.PUBLIC && (
                    <div className="pl-6 space-y-2">
                      <Tooltip
                        open={
                          touched.githubUrl && !isGithubUrlValid
                            ? tooltipVisible.githubUrl ||
                              tooltipHovered.githubUrl
                            : undefined
                        }
                      >
                        <TooltipTrigger asChild>
                          <Label
                            htmlFor="githubUrl"
                            onMouseEnter={() =>
                              setTooltipHovered({
                                ...tooltipHovered,
                                githubUrl: true,
                              })
                            }
                            onMouseLeave={() =>
                              setTooltipHovered({
                                ...tooltipHovered,
                                githubUrl: false,
                              })
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
                          setFormData({
                            ...formData,
                            githubUrl: e.target.value,
                          })
                        }
                        onBlur={() =>
                          setTouched({ ...touched, githubUrl: true })
                        }
                        required
                        data-cy={
                          FooterDataAttributes.CODE_REVIEW_GITHUB_URL_INPUT
                        }
                        className={cn(
                          touched.githubUrl &&
                            !isGithubUrlValid &&
                            "border-destructive"
                        )}
                      />
                    </div>
                  )}
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
              <div className="space-y-3 border border-border rounded-md p-4 bg-muted/20">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <Label className="text-base font-semibold">
                    Non-Disclosure Agreement (NDA)
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="legalEntityName">
                    Legal Entity Name (Individual or Company)
                  </Label>
                  <Input
                    id="legalEntityName"
                    placeholder="John Doe or Acme Corporation"
                    value={formData.nda.legalEntityName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nda: {
                          ...formData.nda,
                          legalEntityName: e.target.value,
                        },
                      })
                    }
                    required={isPrivate}
                    data-cy={
                      FooterDataAttributes.CODE_REVIEW_NDA_LEGAL_NAME_INPUT
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessNumberType">
                    Business Number Type (Optional)
                  </Label>
                  <Select
                    value={formData.nda.businessNumberType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        nda: {
                          ...formData.nda,
                          businessNumberType: value as BusinessNumberType,
                        },
                      })
                    }
                  >
                    <SelectTrigger
                      id="businessNumberType"
                      data-cy={
                        FooterDataAttributes.CODE_REVIEW_NDA_BUSINESS_NUMBER_TYPE_SELECT
                      }
                    >
                      <SelectValue placeholder="Select business number type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BusinessNumberType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.nda.businessNumberType &&
                  formData.nda.businessNumberType !==
                    BusinessNumberType.NONE && (
                    <div className="space-y-2">
                      <Label htmlFor="businessNumber">
                        {formData.nda.businessNumberType}
                      </Label>
                      <Input
                        id="businessNumber"
                        placeholder={`Enter your ${formData.nda.businessNumberType}`}
                        value={formData.nda.businessNumber || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nda: {
                              ...formData.nda,
                              businessNumber: e.target.value,
                            },
                          })
                        }
                        data-cy={
                          FooterDataAttributes.CODE_REVIEW_NDA_BUSINESS_NUMBER_INPUT
                        }
                      />
                    </div>
                  )}

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handlePreviewNDA}
                    disabled={!formData.nda.legalEntityName}
                    className="gap-2"
                    data-cy={
                      FooterDataAttributes.CODE_REVIEW_NDA_PREVIEW_BUTTON
                    }
                  >
                    <FileText className="w-4 h-4" />
                    Preview & Download NDA
                  </Button>
                </div>

                <p className="text-sm italic text-muted-foreground">
                  An NDA is required for private repositories, it will be
                  automatically attached to your submission email. Jurisdiction:
                  Victoria, Australia.
                </p>
              </div>
            )}

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
                          1. Service Model and Free Code Review
                        </h4>
                        <p>
                          The code review and quote are provided completely free
                          of charge. No payment is required to receive:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>End-to-end and unit test results</li>
                          <li>Code review findings</li>
                          <li>Fixed-price quote for refactoring work</li>
                        </ul>
                        <p className="mt-2">
                          If you choose to proceed with the refactoring work,
                          the reviewer will complete the work and demonstrate
                          the completed implementation to you. At that point,
                          you may purchase the completed refactored code as a
                          product.
                        </p>

                        <h4 className="font-semibold">2. Payment via Stripe</h4>
                        <p>
                          All payments are processed exclusively through{" "}
                          <strong>Stripe</strong>, which provides:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Dispute Resolution:</strong> If the
                            delivered code doesn&apos;t match the agreed
                            specification or has significant issues, you can
                            initiate a dispute through Stripe&apos;s resolution
                            process with documented evidence.
                          </li>

                          <li>
                            <strong>Transaction Records:</strong> All payments
                            and refunds are tracked and documented for tax and
                            accounting purposes.
                          </li>
                        </ul>

                        <h4 className="font-semibold">
                          3. Private Repository Access and NDA Requirements
                        </h4>
                        <p>
                          For private repositories, a mutual Non-Disclosure
                          Agreement (NDA) is required before your code will be
                          reviewed. You will provide your legal entity name
                          through this form, and a pre-filled NDA will be
                          generated for download. Alternatively, you may request
                          to use your own NDA. After signing and returning the
                          NDA via email, you can grant collaborator access to
                          the GitHub user <strong>AaronGazzola</strong> with
                          read access to your private repository.
                        </p>

                        <h4 className="font-semibold">
                          4. 30-Day Support and Money-Back Guarantee
                        </h4>
                        <p>
                          Upon purchasing the refactored code, you receive 30
                          days of comprehensive support including:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Ongoing email/messaging assistance</li>
                          <li>Bug fixes</li>
                          <li>Troubleshooting</li>
                          <li>Additional documentation</li>
                          <li>
                            <strong>Full refund</strong> if you have any issues
                            with the delivered code within 30 days of purchase
                          </li>
                        </ul>
                        <p className="mt-2">
                          The 30-day guarantee applies only to the{" "}
                          <strong>unaltered code</strong> as delivered. The
                          reviewer can independently verify this by
                          demonstrating the deployment process and providing the
                          deployment URL.
                        </p>
                        <p className="mt-2">
                          Submit refund requests in writing via email before the
                          30-day period expires. Refunds are processed through
                          Stripe, and you may initiate a dispute through
                          Stripe&apos;s resolution process if needed.
                        </p>

                        <h4 className="font-semibold">
                          5. Development Environment
                        </h4>
                        <p>
                          The reviewer will clone your repository and use their
                          own accounts for databases and third-party API
                          services during development and testing. You are
                          responsible for ensuring your repository does not
                          contain sensitive credentials or API keys.
                        </p>

                        <h4 className="font-semibold">
                          6. Intellectual Property
                        </h4>
                        <p>
                          Your original code remains your intellectual property.
                          Any improvements or modifications made by the reviewer
                          become your property only upon full payment and
                          delivery of the final code.
                        </p>

                        <h4 className="font-semibold">
                          7. Privacy and Email Usage
                        </h4>
                        <p>
                          Your email address will only be used for direct
                          correspondence between Aaron Gazzola and you regarding
                          your code review request and any subsequent project
                          work. Your email will not be shared with third parties
                          or used for marketing purposes.
                        </p>

                        <h4 className="font-semibold">
                          8. Public Livestream Consent
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
                          from any public sharing.
                        </p>

                        <h4 className="font-semibold">9. Confidentiality</h4>
                        <p>
                          For private repositories or public repositories
                          without livestream consent, the reviewer agrees to
                          maintain confidentiality of your code and will not
                          share, distribute, or use your code for any purpose
                          other than the agreed-upon review and refactoring
                          services. For private repositories, this commitment is
                          legally enforced through the required mutual NDA.
                        </p>

                        <h4 className="font-semibold">
                          10. Service Availability and Discretion
                        </h4>
                        <p>
                          The code review service is provided on a discretionary
                          basis. The reviewer reserves the right to accept or
                          decline any code review request without explanation.
                          Submission of a code review request does not
                          guarantee:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            That the reviewer will respond to your request
                          </li>
                          <li>
                            That a code review will be initiated or completed
                          </li>
                          <li>
                            That a quote for refactoring work will be provided
                          </li>
                        </ul>
                        <p className="mt-2">
                          The reviewer may discontinue a code review at any time
                          for any reason, including after initial review has
                          commenced. No compensation or consideration is owed
                          for incomplete or declined reviews, as the service is
                          provided entirely free of charge at the
                          reviewer&apos;s discretion.
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
