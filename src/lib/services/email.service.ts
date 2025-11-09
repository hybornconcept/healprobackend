import { Resend } from "resend";
import { env } from "cloudflare:workers";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private resend: Resend;
  private defaultFromEmail: string;

  constructor(apiKey?: string, defaultFrom?: string) {
    this.resend = new Resend(apiKey || env.RESEND_API_KEY);
    this.defaultFromEmail = defaultFrom || "noreply@example.com";
  }

  async sendEmail(options: EmailOptions) {
    try {
      const { to, subject, html, from = this.defaultFromEmail } = options;

      console.log("📧 Sending email:", {
        from,
        to,
        subject,
        htmlLength: html.length,
      });

      const result = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      console.log("✅ Email sent successfully:", {
        to,
        subject,
        id: result.data?.id,
      });
      return result;
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw error;
    }
  }
}

// Export singleton instance with default config
export const emailService = new EmailService();
