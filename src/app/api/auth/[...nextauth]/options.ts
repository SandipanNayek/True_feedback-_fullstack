import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email: { label: "Email ", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any): Promise<any> {
                await dbConnect();
                  
                try {
                    const user = await UserModel.findOne({
                    $or:[
                          {email: credentials.identifier},
                          {username: credentials.identifier}
                    ]
                   })
                   if(!user){
                    throw new Error("No user found with the provided email or username");
                   }

                   if(!user.isVerified){
                    throw new Error("User is not verified. Please check your email for the verification code.");
                   }

                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                     if(isPasswordCorrect){
                        return user;
                     }
                     else{
                        throw new Error("Incorrect password");
                     }
                } catch (error: any) {
                    throw new Error(error.message || "An error occurred during authentication");
                }
            }

        })
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.userName = user.userName;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.userName = token.userName;
            }
            return session;
        }
    },
    pages:{
        signIn: '/sign-in',

    },
    session:{
        strategy: "jwt",
    },
    secret:process.env.NEXTAUTH_SECRET,
}