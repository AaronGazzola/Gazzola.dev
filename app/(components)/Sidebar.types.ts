import { DomainBrand } from "@/lib/domain.config";

export interface FeedbackFormData {
  message: string;
  brand: DomainBrand;
}

export enum SidebarDataAttributes {
  FEEDBACK_DIALOG = "feedback-dialog",
  FEEDBACK_MESSAGE_INPUT = "feedback-message-input",
  FEEDBACK_SUBMIT_BUTTON = "feedback-submit-button",
  FEEDBACK_CANCEL_BUTTON = "feedback-cancel-button",
  SUCCESS_FEEDBACK_SUBMIT = "success-feedback-submit",
  ERROR_FEEDBACK_SUBMIT = "error-feedback-submit",
  FEEDBACK_BUTTON_EXPANDED = "feedback-button-expanded",
  FEEDBACK_BUTTON_COLLAPSED = "feedback-button-collapsed",
}
