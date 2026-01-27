import { DomainBrand } from "@/lib/domain.config";

export interface CodeReviewFormData {
  name: string;
  email: string;
  message: string;
  brand: DomainBrand;
}

export enum FooterDataAttributes {
  FOOTER = "footer",
  FOOTER_TRIGGER = "footer-trigger",
  CODE_REVIEW_DIALOG = "code-review-dialog",
  CODE_REVIEW_NAME_INPUT = "code-review-name-input",
  CODE_REVIEW_MESSAGE_INPUT = "code-review-message-input",
  CODE_REVIEW_EMAIL_INPUT = "code-review-email-input",
  CODE_REVIEW_SUBMIT_BUTTON = "code-review-submit-button",
  CODE_REVIEW_CANCEL_BUTTON = "code-review-cancel-button",
  SUCCESS_CODE_REVIEW_SUBMIT = "success-code-review-submit",
  ERROR_CODE_REVIEW_SUBMIT = "error-code-review-submit",
}
