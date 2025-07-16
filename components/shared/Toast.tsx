//-| File path: components/shared/Toast.tsx

import { AlertTriangle, Bell, CheckCircle, XCircle } from "lucide-react";
import React from "react";

type ToastVariant = "success" | "error" | "notification" | "warning";

interface ToastProps {
  variant: ToastVariant;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  "data-cy"?: string;
}

const getDefaultTitle = (variant: ToastVariant): string => {
  switch (variant) {
    case "success":
      return "Success";
    case "error":
      return "Error";
    case "notification":
      return "Notification";
    case "warning":
      return "Warning";
    default:
      return variant;
  }
};

const getDefaultIcon = (variant: ToastVariant): React.ReactNode => {
  const iconProps = { size: 20, className: "flex-shrink-0" };

  switch (variant) {
    case "success":
      return (
        <CheckCircle
          {...iconProps}
          className={`${iconProps.className} text-green-500`}
        />
      );
    case "error":
      return (
        <XCircle
          {...iconProps}
          className={`${iconProps.className} text-red-500`}
        />
      );
    case "notification":
      return (
        <Bell
          {...iconProps}
          className={`${iconProps.className} text-blue-500`}
        />
      );
    case "warning":
      return (
        <AlertTriangle
          {...iconProps}
          className={`${iconProps.className} text-yellow-500`}
        />
      );
    default:
      return <Bell {...iconProps} />;
  }
};

const getVariantClasses = (variant: ToastVariant): string => {
  const baseClasses =
    "flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-[500px]";

  switch (variant) {
    case "success":
      return `${baseClasses} bg-green-950/50 border-green-800/50 text-green-100`;
    case "error":
      return `${baseClasses} bg-red-950/50 border-red-800/50 text-red-100`;
    case "notification":
      return `${baseClasses} bg-blue-950/50 border-blue-800/50 text-blue-100`;
    case "warning":
      return `${baseClasses} bg-yellow-950/50 border-yellow-800/50 text-yellow-100`;
    default:
      return `${baseClasses} bg-gray-950/50 border-gray-800/50 text-gray-100`;
  }
};

export const Toast: React.FC<ToastProps> = ({
  variant,
  title = getDefaultTitle(variant),
  message,
  icon = getDefaultIcon(variant),
  "data-cy": cyData = variant,
}) => {
  return (
    <div className={getVariantClasses(variant)} data-data-cy={cyData}>
      {icon}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm mb-1">{title}</div>
        {message && (
          <div className="text-sm opacity-90 leading-relaxed">{message}</div>
        )}
      </div>
    </div>
  );
};
