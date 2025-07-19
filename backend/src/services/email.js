const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const send2FACode = async (to, code) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Ваш код подтверждения',
    text: `Ваш код подтверждения: ${code}`,
  });
};

module.exports = { send2FACode }; 