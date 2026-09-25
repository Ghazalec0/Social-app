import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";
import { SEND_MAIL_PASS, SEND_MAIL_USER } from "../../config";

export const sendMail = async ({ to, subject, html }: SendMailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: SEND_MAIL_USER,
      pass: SEND_MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"social app" <dev.ghazaleco@gmail.com>',
    to,
    subject,
    html,
  });
};