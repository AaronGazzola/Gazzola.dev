"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { Resend } from "resend";
import { CreditDepletionEmail } from "@/emails/CreditDepletion";
import { CreditDepletionNotificationData } from "./CreditDepletionDialog.types";

export const sendCreditDepletionNotificationAction = async (
  data: CreditDepletionNotificationData
): Promise<ActionResponse<{ success: boolean }>> => {
  try {
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
      from: "Gazzola.dev Alerts <onboarding@resend.dev>",
      to: adminEmail,
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
