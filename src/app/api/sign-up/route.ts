import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/src/helper/sendVerificationemail";

export async function POST(request: Request) {
    await dbConnect()

    try {
      const { email, username, password } = await request.json();
    } catch (error) {
        console.error("Error during user registration:", error);
        return Response.json({ success: false, message: "An error occurred during registration. Please try again later." }, { status: 500 });
    }
}