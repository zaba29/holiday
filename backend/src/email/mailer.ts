import nodemailer from 'nodemailer';
import { config } from '../config/env';

export const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: config.smtp.user
    ? {
        user: config.smtp.user,
        pass: config.smtp.password,
      }
    : undefined,
});

export const sendMail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  const info = await transporter.sendMail({
    from: `Holiday Bot <${config.adminEmail}>`,
    ...options,
  });
  return info.messageId;
};
