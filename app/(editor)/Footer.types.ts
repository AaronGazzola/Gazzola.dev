export enum RepositoryVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export interface CodeReviewFormData {
  githubUrl: string;
  message: string;
  email: string;
  visibility: RepositoryVisibility;
  hasInvitedCollaborator?: boolean;
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
  CODE_REVIEW_COLLABORATOR_CHECKBOX = "code-review-collaborator-checkbox",
  CODE_REVIEW_SUBMIT_BUTTON = "code-review-submit-button",
  CODE_REVIEW_CANCEL_BUTTON = "code-review-cancel-button",
  SUCCESS_CODE_REVIEW_SUBMIT = "success-code-review-submit",
  ERROR_CODE_REVIEW_SUBMIT = "error-code-review-submit",
}
