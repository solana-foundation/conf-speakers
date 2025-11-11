import sgMail from "@sendgrid/mail";

type SendMagicLinkArgs = {
  to: string;
  magicLink: string;
  recipientName?: string;
  expiresInLabel?: string;
  eventTitle?: string;
};

const apiKey = process.env.SENDGRID_API_KEY;
const defaultTemplateId = process.env.SENDGRID_TEMPLATE_ID;
const fromEmail = process.env.SENDGRID_FROM_EMAIL ?? "speakers@solana.org";
const fromName = process.env.SENDGRID_FROM_NAME ?? "Breakpoint Speakers";
const sandboxMode = process.env.SENDGRID_SANDBOX_MODE === "true";

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function sendMagicLinkEmail({
  to,
  magicLink,
  recipientName,
  expiresInLabel,
  eventTitle,
}: SendMagicLinkArgs) {
  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY is not set");
  }

  if (!defaultTemplateId) {
    throw new Error("SENDGRID_TEMPLATE_ID is not set");
  }

  const email = {
    from: {
      email: fromEmail,
      name: fromName,
    },
    personalizations: [
      {
        to: [{ email: to }],
        dynamicTemplateData: {
          recipient_name: recipientName ?? "there",
          magic_link: magicLink,
          expires_in: expiresInLabel ?? "a month",
          event_title: eventTitle ?? "Breakpoint Speaker Portal",
        },
      },
    ],
    templateId: defaultTemplateId,
    mailSettings: sandboxMode
      ? {
          sandboxMode: {
            enable: true,
          },
        }
      : undefined,
  };

  await sgMail.send(email);
}
