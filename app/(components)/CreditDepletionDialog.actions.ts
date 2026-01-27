"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { getDomainConfig } from "@/lib/domain.utils";
import { Resend } from "resend";
import { CreditDepletionEmail } from "@/emails/CreditDepletion";
import { CreditDepletionNotificationData } from "./CreditDepletionDialog.types";

export const sendCreditDepletionNotificationAction = async (
  data: CreditDepletionNotificationData
): Promise<ActionResponse<{ success: boolean }>> => {
  try {
    const config = getDomainConfig(data.brand);

    if (!config.resendApiKey) {
      throw new Error(
        `RESEND_API_KEY environment variable is not set for ${data.brand}`
      );
    }

    if (!config.adminEmail) {
      throw new Error(
        `ADMIN_EMAIL environment variable is not set for ${data.brand}`
      );
    }

    const resend = new Resend(config.resendApiKey);

    const { error } = await resend.emails.send({
      from: `${config.email.fromName} <onboarding@resend.dev>`,
      to: config.adminEmail,
      subject: "URGENT: OpenRouter Credits Depleted",
      react: CreditDepletionEmail({
        timestamp: data.timestamp,
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
