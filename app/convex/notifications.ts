import { action } from "./_generated/server";
import { v } from "convex/values";
import sgMail from "@sendgrid/mail";
import twilio from "twilio";

const apiKey = process.env.SENDGRID_API_KEY!;
const senderEmail = process.env.SENDER_EMAIL!;

sgMail.setApiKey(apiKey);

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

const twilioClient = twilio(accountSid, authToken);

export const sendEmail = action({
  args: { to: v.string(), subject: v.string(), body: v.string() },
  handler: async (_, { to, subject, body }) => {
    const msg = {
      to,
      from: senderEmail,
      subject,
      html: body,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(error);
    }
  },
});

export const sendWhatsApp = action({
  args: { to: v.string(), body: v.string() },
  handler: async (_, { to, body }) => {
    const msg = {
      body,
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${to}`,
    };

    try {
      await twilioClient.messages.create(msg);
      console.log(`WhatsApp message sent to ${to}`);
    } catch (error) {
      console.error(error);
    }
  },
});