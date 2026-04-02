const nodemailer = require("nodemailer");

function canSendEmail() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendAdminOtpEmail({ to, code, requesterEmail, requesterName }) {
  const subject = "BMZ Admin OTP";
  const text = `Код входа в админку BMZ: ${code}\n\nЗаявка от: ${requesterName} (${requesterEmail})\nКод действует 10 минут.`;

  if (!canSendEmail()) {
    // eslint-disable-next-line no-console
    console.log(`[OTP] SMTP not configured. Would send to ${to}: ${code} (${requesterName} / ${requesterEmail})`);
    return { delivered: false };
  }

  const transporter = createTransport();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });

  return { delivered: true };
}

module.exports = { sendAdminOtpEmail, canSendEmail };

