"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { Resend } from "resend";
import { CodeReviewRequestEmail } from "@/emails/CodeReviewRequest";
import { CodeReviewFormData, RepositoryVisibility } from "./Footer.types";
import { generateNDAPDFServer } from "./nda.server.utils";

export const submitCodeReviewAction = async (
  formData: CodeReviewFormData
): Promise<ActionResponse<{ success: boolean }>> => {
  try {
    const githubUrlRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubUrlRegex.test(formData.githubUrl)) {
      throw new Error("Invalid GitHub URL format");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error("Invalid email format");
    }

    if (process.env.RESEND_API_KEY) {
      const adminEmail = process.env.ADMIN_EMAIL;

      if (!adminEmail) {
        throw new Error("ADMIN_EMAIL environment variable is not set");
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      const emailData: any = {
        from: "Code Review Requests <onboarding@resend.dev>",
        to: adminEmail,
        replyTo: formData.email,
        subject: `Code Review Request from ${formData.email}${formData.nda.requestNDA ? " [NDA Requested]" : ""}`,
        react: CodeReviewRequestEmail({
          githubUrl: formData.githubUrl,
          message: formData.message,
          userEmail: formData.email,
          isPrivate: formData.visibility === RepositoryVisibility.PRIVATE,
          ndaRequested: formData.nda.requestNDA,
          ndaDetails: formData.nda.requestNDA ? formData.nda : undefined,
        }),
      };

      if (formData.nda.requestNDA && formData.nda.legalEntityName && formData.nda.jurisdiction) {
        const { content, filename } = generateNDAPDFServer(formData.nda);
        emailData.attachments = [
          {
            filename,
            content,
          },
        ];
      }

      const { error } = await resend.emails.send(emailData);

      if (error) {
        throw new Error(error.message);
      }
    }

    return getActionResponse({ data: { success: true } });
  } catch (error) {
    return getActionResponse({ error });
  }
};
