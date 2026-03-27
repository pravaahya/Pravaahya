import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, htmlContent: string, attachments?: any[]): Promise<boolean> => {
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL } = process.env;

    // Fail organically if the administrative payload keys are unmounted avoiding fatal runtime loops.
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || SMTP_USER.includes('your_')) {
      console.warn('[SMTP Operations] Automated Email delivery skipped implicitly: Local SMTP environment block missing.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.warn(`[SMTP Operations] Aborted explicitly: Address formatting constraint violated (${to}).`);
      return false;
    }

    // Instantiation mapping
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465, // TLS strictly bounded generically natively.
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // Dev override seamlessly matching generic SMPT domains natively without self-signed collision.
      }
    });

    const info = await transporter.sendMail({
      from: SMTP_FROM_EMAIL || `"Pravaahya System Node" <${SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments,
    });

    console.log(`[SMTP Operations] Encrypted buffer strictly dispatched to network bounds identifying node ${info.messageId}`);
    return true;
  } catch (error: any) {
    // Retry logging internally resolving crashes silently parsing the exact error output.
    console.error('[SMTP Operations] Critical Dispatch Fault caught gracefully natively:', error.message);
    return false;
  }
};
