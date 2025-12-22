"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { Resend } from "resend";
import { CodeReviewRequestEmail } from "@/emails/CodeReviewRequest";
import { CodeReviewFormData } from "./Footer.types";

export const submitCodeReviewAction = async (
  formData: CodeReviewFormData
): Promise<ActionResponse<{ success: boolean }>> => {
  try {
    const nameRegex = /^[\p{L}\s'-]{2,100}$/u;
    if (!nameRegex.test(formData.name.trim())) {
      throw new Error("Invalid name format");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error("Invalid email format");
    }

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
      from: "Contact Form <onboarding@resend.dev>",
      to: adminEmail,
      replyTo: formData.email,
      subject: `Quality Assurance Inquiry from ${formData.name}`,
      react: CodeReviewRequestEmail({
        name: formData.name,
        email: formData.email,
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
