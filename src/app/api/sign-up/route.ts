import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/src/helper/sendVerificationemail";

export async function POST(request: Request) {
    await dbConnect()

    try {
      const { email, username, password } = await request.json();
     const existingUserVerifiedByUsername = await UserModel.find({
        username,
        isVerified: true
      })

      if(existingUserVerifiedByUsername ) {
       return Response.json({ success: false, message: "Username is already taken." }, { status: 400 });
      }

      const existingUserByEmail = await UserModel.findOne({email})

      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserByEmail) {

        }
        else{
           const hasedPassword = await bcrypt.hash(password, 10)

           const expiryDate = new Date()
              expiryDate.setHours(expiryDate.getHours() + 1)

              const newUser = new UserModel({
                    username,
                    email,
                    password:hasedPassword,
                    verifyCode,
                    verifyCodeExpire:expiryDate,
                    isVerified:false,
                    isAcceptingMessages:true,
                    messages:[]
              })

              await newUser.save()
        }

        // Send verification email
        
    } catch (error) {
        console.error("Error during user registration:", error);
        return Response.json({ success: false, message: "An error occurred during registration. Please try again later." }, { status: 500 });
    }
}
                      isAcceptingMessages:boolean;
                      messages:Message[];
              })
        }
    } catch (error) {
        console.error("Error during user registration:", error);
        return Response.json({ success: false, message: "An error occurred during registration. Please try again later." }, { status: 500 });
    }
}