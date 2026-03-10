import type { Express } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";
import { insertQuoteRequestSchema } from "@shared/schema";
import { storage } from "./storage";

let _transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return _transporter;
}

const RECIPIENT_EMAIL = "TwinForceVeteranJanitorialllc@yahoo.com";

async function sendQuoteEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message?: string | null;
}) {
  const serviceLabel = data.service
    ? data.service.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Not specified";

  const emailBody = `
New Quote Request from TwinForce Website

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Company: ${data.company || "Not provided"}
Service Needed: ${serviceLabel}

Message:
${data.message || "No message provided"}

---
This request was submitted through the TwinForce Veteran Janitorial website.
  `.trim();

  const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #1e293b; padding: 20px; text-align: center;">
    <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">TwinForce</h1>
    <p style="color: #94a3b8; margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Veteran Janitorial</p>
  </div>
  <div style="background-color: #f8fafc; padding: 24px;">
    <h2 style="color: #1e293b; margin-top: 0;">New Quote Request</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #64748b; width: 120px;">Name:</td><td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Phone:</td><td style="padding: 8px 0; color: #1e293b;">${data.phone || "Not provided"}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Company:</td><td style="padding: 8px 0; color: #1e293b;">${data.company || "Not provided"}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Service:</td><td style="padding: 8px 0; color: #1e293b;">${serviceLabel}</td></tr>
    </table>
    ${data.message ? `<div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;"><p style="color: #64748b; margin: 0 0 8px; font-size: 13px;">Message:</p><p style="color: #1e293b; margin: 0; line-height: 1.6;">${data.message}</p></div>` : ""}
  </div>
  <div style="background-color: #1e293b; padding: 16px; text-align: center;">
    <p style="color: #64748b; margin: 0; font-size: 12px;">Submitted via TwinForce Veteran Janitorial Website</p>
  </div>
</div>
  `.trim();

  try {
    await getTransporter().sendMail({
      from: `"TwinForce Website" <${process.env.SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      subject: `New Quote Request from ${data.name}`,
      text: emailBody,
      html: htmlBody,
    });
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/quote-requests", async (req, res) => {
    try {
      const parsed = insertQuoteRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request data", details: parsed.error.errors });
      }

      await storage.createQuoteRequest(parsed.data);

      const emailSent = await sendQuoteEmail(parsed.data);

      res.status(201).json({
        success: true,
        emailSent,
        message: emailSent
          ? "Your request has been submitted and sent to our team."
          : "Your request has been saved. Our team will review it shortly.",
      });
    } catch (error) {
      console.error("Error processing quote request:", error);
      res.status(500).json({ error: "Failed to submit quote request" });
    }
  });

  return httpServer;
}
