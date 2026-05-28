import nodemailer from 'nodemailer';

class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Standard configuration for Gmail or Google Workspace
    // Note: In production, use OAuth2 or an App Password, and store credentials in .env
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'hello@bharatventures.in', 
        pass: process.env.SMTP_PASS || 'mock-password-for-dev'
      }
    });
  }

  /**
   * Send a beautiful HTML email via Nodemailer
   */
  async sendEmail(to: string, subject: string, html: string) {
    try {
      if (!process.env.SMTP_PASS) {
        // Mock sending if no real password is provided
        console.log(`\n📧 [EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        console.log(`HTML Payload length: ${html.length} bytes\n`);
        return true;
      }

      const info = await this.transporter.sendMail({
        from: `"Bharat Ventures" <${process.env.SMTP_USER || 'hello@bharatventures.in'}>`,
        to,
        subject,
        html,
      });
      console.log(`📧 Email sent to ${to}: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }

  /**
   * Enterprise Use Cases Below
   */

  async sendWelcomeInvite(email: string, tempPassword: string, role: string) {
    const subject = `Welcome to Bharat Ventures - ${role} Access Provisioned`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #f47220; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">Bharat Ventures</h2>
        </div>
        <div style="padding: 30px;">
          <p>Hello,</p>
          <p>You have been provisioned access to the Bharat Ventures Enterprise Platform as a <strong>${role}</strong>.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #666; text-transform: uppercase;">Secure Credentials</p>
            <p style="margin: 0 0 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0;"><strong>Temporary Password:</strong> <code style="background: #eef; padding: 2px 6px; border-radius: 4px;">${tempPassword}</code></p>
          </div>
          <p>Please log in and change your password immediately.</p>
          <a href="https://app.bharatventures.in/login" style="display: inline-block; background-color: #111; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 10px;">Login to Dashboard</a>
        </div>
      </div>
    `;
    return this.sendEmail(email, subject, html);
  }

  async sendStartupOnboardingAlert(founderEmail: string, daysRemaining: number) {
    const subject = `Bharat Accelerator - Legal Onboarding Initiated`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 30px;">
        <h2 style="color: #f47220;">Legal Onboarding</h2>
        <p>Congratulations, your startup has passed the initial selection.</p>
        <p>You now have <strong>${daysRemaining} days</strong> to finalize term sheets and equity agreements.</p>
        <p>Please check your Founder Dashboard for the required due diligence document checklist.</p>
      </div>
    `;
    return this.sendEmail(founderEmail, subject, html);
  }
}

export const notificationService = new NotificationService();
