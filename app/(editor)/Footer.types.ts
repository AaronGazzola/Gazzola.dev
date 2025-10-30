export enum RepositoryVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum BusinessNumberType {
  ABN = "ABN (Australia)",
  ACN = "ACN (Australia)",
  EIN = "EIN (USA)",
  VAT_UK = "VAT (UK)",
  VAT_EU = "VAT (EU)",
  GST_NZ = "GST (New Zealand)",
  GST_CANADA = "GST/HST (Canada)",
  CRN_INDIA = "CIN/CRN (India)",
  COMPANY_UK = "Company Number (UK)",
  NONE = "No Business Number",
}

export interface NDAFormData {
  legalEntityName: string;
  jurisdiction: string;
  effectiveDate: string;
  businessNumberType?: BusinessNumberType;
  businessNumber?: string;
}

export interface CodeReviewFormData {
  githubUrl: string;
  message: string;
  email: string;
  visibility: RepositoryVisibility;
  agreedToTerms: boolean;
  allowLivestream?: boolean;
  nda: NDAFormData;
}

export enum FooterDataAttributes {
  FOOTER = "footer",
  FOOTER_TRIGGER = "footer-trigger",
  CODE_REVIEW_DIALOG = "code-review-dialog",
  CODE_REVIEW_GITHUB_URL_INPUT = "code-review-github-url-input",
  CODE_REVIEW_MESSAGE_INPUT = "code-review-message-input",
  CODE_REVIEW_EMAIL_INPUT = "code-review-email-input",
  CODE_REVIEW_PUBLIC_RADIO = "code-review-public-radio",
  CODE_REVIEW_PRIVATE_RADIO = "code-review-private-radio",
  CODE_REVIEW_LIVESTREAM_CHECKBOX = "code-review-livestream-checkbox",
  CODE_REVIEW_TERMS_CHECKBOX = "code-review-terms-checkbox",
  CODE_REVIEW_TERMS_POPOVER_TRIGGER = "code-review-terms-popover-trigger",
  CODE_REVIEW_SUBMIT_BUTTON = "code-review-submit-button",
  CODE_REVIEW_CANCEL_BUTTON = "code-review-cancel-button",
  SUCCESS_CODE_REVIEW_SUBMIT = "success-code-review-submit",
  ERROR_CODE_REVIEW_SUBMIT = "error-code-review-submit",
  CODE_REVIEW_NDA_COLLAPSIBLE = "code-review-nda-collapsible",
  CODE_REVIEW_NDA_REQUEST_CHECKBOX = "code-review-nda-request-checkbox",
  CODE_REVIEW_NDA_LEGAL_NAME_INPUT = "code-review-nda-legal-name-input",
  CODE_REVIEW_NDA_BUSINESS_NUMBER_TYPE_SELECT = "code-review-nda-business-number-type-select",
  CODE_REVIEW_NDA_BUSINESS_NUMBER_INPUT = "code-review-nda-business-number-input",
  CODE_REVIEW_NDA_PREVIEW_BUTTON = "code-review-nda-preview-button",
}
