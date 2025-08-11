import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let africastalking = null;
try {
  // This assumes africastalking package installed and supports ESM import
  // If your version fails, you can require it using createRequire or use axios for HTTP calls.
  // Many installations work with: import africastalking from 'africastalking';
  // eslint-disable-next-line
  africastalking = (await import("africastalking")).default;
} catch (e) {
  // no-op — we'll handle gracefully below
}

const AT_USERNAME = process.env.AT_USERNAME;
const AT_API_KEY = process.env.AT_API_KEY;
const ADMIN_PHONE = process.env.ADMIN_PHONE;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const sendSMS = async (message, to = ADMIN_PHONE) => {
  if (!AT_USERNAME || !AT_API_KEY) {
    console.warn("AfricaTalking credentials missing in .env; SMS not sent.");
    return { success: false, error: "AT credentials missing" };
  }

  if (!africastalking) {
    // Try a dynamic require fallback (works in many setups)
    try {
      const { default: at } = await import("africastalking");
      africastalking = at;
    } catch (err) {
      console.error("Failed to import africastalking package:", err.message);
      return { success: false, error: err.message };
    }
  }

  const at = africastalking({
    apiKey: AT_API_KEY,
    username: AT_USERNAME,
  });

  const sms = at.SMS;

  try {
    const response = await sms.send({
      to: Array.isArray(to) ? to : [to],
      message,
      from: AT_USERNAME,
    });
    return { success: true, response };
  } catch (err) {
    console.error("SMS sending error:", err);
    return { success: false, error: err.message || err };
  }
};

export const sendEmail = async (subject, text, html, to = ADMIN_EMAIL) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn("SMTP credentials missing in .env; email not sent.");
    return { success: false, error: "SMTP credentials missing" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Lamasha Daycare" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (err) {
    console.error("Email sending error:", err);
    return { success: false, error: err.message || err };
  }
};
