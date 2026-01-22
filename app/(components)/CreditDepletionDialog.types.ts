export interface CreditDepletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export enum CreditDepletionDataAttributes {
  DIALOG = "credit-depletion-dialog",
  CLOSE_BUTTON = "credit-depletion-close-button",
  SUCCESS_NOTIFICATION = "success-credit-depletion-notification",
  ERROR_NOTIFICATION = "error-credit-depletion-notification",
}

export interface CreditDepletionNotificationData {
  timestamp: string;
}
