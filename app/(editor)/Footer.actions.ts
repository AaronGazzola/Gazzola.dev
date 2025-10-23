"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { Resend } from "resend";
import { CodeReviewRequestEmail } from "@/emails/CodeReviewRequest";
import { CodeReviewFormData, RepositoryVisibility } from "./Footer.types";

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

    if (formData.visibility === RepositoryVisibility.PRIVATE && !formData.hasInvitedCollaborator) {
      throw new Error("You must invite AaronGazzola as a collaborator for private repositories");
    }

    if (process.env.RESEND_API_KEY) {
      const adminEmail = process.env.ADMIN_EMAIL;

      if (!adminEmail) {
        throw new Error("ADMIN_EMAIL environment variable is not set");
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      const { error } = await resend.emails.send({
        from: "Code Review Requests <onboarding@resend.dev>",
        to: adminEmail,
        replyTo: formData.email,
        subject: `Code Review Request from ${formData.email}`,
        react: CodeReviewRequestEmail({
          githubUrl: formData.githubUrl,
          message: formData.message,
          userEmail: formData.email,
          isPrivate: formData.visibility === RepositoryVisibility.PRIVATE,
          hasInvitedCollaborator: formData.hasInvitedCollaborator,
        }),
      });

      if (error) {
        throw new Error(error.message);
      }
    }

    return getActionResponse({ data: { success: true } });
  } catch (error) {
    return getActionResponse({ error });
  }
};
