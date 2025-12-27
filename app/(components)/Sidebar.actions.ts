"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
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

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error("ADMIN_EMAIL environment variable is not set");
    }

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: "Feedback Form <onboarding@resend.dev>",
      to: adminEmail,
      subject: "New Feedback / Bug Report",
      react: FeedbackEmail({
        message: formData.message,
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
