import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, code } = await request.json();

    const decodedUsername = decodeURIComponent(userName).trim();

    console.log("Received username:", userName);
    console.log("Decoded username:", decodedUsername);

    const user = await UserModel.findOne({
      userName: decodedUsername,
    });

    console.log("Found user:", user);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    console.log("Stored code:", user.verifyCode);
    console.log("Entered code:", code);
    console.log("Stored expiry:", user.verifyCodeExpire);
    console.log("Current time:", new Date());

    const isCodeValid = user.verifyCode === code;

    const isCodeNotExpired =
      new Date(user.verifyCodeExpire).getTime() > Date.now();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    }

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Invalid verification code",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying code:", error);

    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}