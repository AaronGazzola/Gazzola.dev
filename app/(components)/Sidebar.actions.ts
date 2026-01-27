"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { getDomainConfig } from "@/lib/domain.utils";
import { Resend } from "resend";
import { FeedbackEmail } from "@/emails/Feedback";
import { FeedbackFormData } from "./Sidebar.types";

export const submitFeedbackAction = async (
  formData: FeedbackFormData
): Promise<ActionResponse<{ success: boolean }>> => {
  try {
    if (!formData.message.trim()) {
      throw new Error("Message cannot be empty");
    }

    const config = getDomainConfig(formData.brand);

    if (!config.resendApiKey) {
      throw new Error(
        `RESEND_API_KEY environment variable is not set for ${formData.brand}`
      );
    }

    if (!config.adminEmail) {
      throw new Error(
        `ADMIN_EMAIL environment variable is not set for ${formData.brand}`
      );
    }

    const resend = new Resend(config.resendApiKey);

    const { error } = await resend.emails.send({
      from: `Feedback Form <${config.email.fromEmail}>`,
      to: config.adminEmail,
      subject: "New Feedback / Bug Report",
      react: FeedbackEmail({
        message: formData.message,
        brand: formData.brand,
      }),
    });

    if (error) {
      throw new Error(error.message);
    }

    return getActionResponse({ data: { success: true } });
  } catch (error) {
    return getActionResponse({ error });
  }
};
