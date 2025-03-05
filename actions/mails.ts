"use server";

import { MailProps } from "@/components/Dashboard/ComposeMailForm";
import { Resend } from "resend";

export async function sendEmail(mailData: MailProps) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { to, subject, html, attachments } = mailData;
  try {
    const sendMail = await resend.emails.send({
      from: "Medical App <info@jazzafricaadventures.com>",
      to: to,
      subject: subject,
      html: html,
      attachments: attachments.map((file) => ({
        filename: file.title,
        path: file.url,
      })),
    });
    console.log(sendMail);
    return {
      data: sendMail,
      error: null,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong",
    };
  }
}
