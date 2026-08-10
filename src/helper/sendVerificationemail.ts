import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHtml = await render(
      VerificationEmail({
        username,
        otp: verifyCode,
      })
    );

    await transporter.sendMail({
      from: `Mystery Message <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Email",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);

    return {
      success: false,
      message: "Failed to send verification email. Please try again later.",
    };
  }
}