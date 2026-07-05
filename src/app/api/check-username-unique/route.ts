import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {userNameValidation} from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request){
    await dbConnect()

    try{
     const {searchParams} = new URL(request.url)
     const queryParam = {
        username: searchParams.get('username')
     }
     // validate the query parameter using Zod
        const result =   UsernameQuerySchema.safeParse(queryParam)
        console.log('Validation result:', result);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: 'Invalid username format.',
                errors: usernameErrors
            },
        {status:400})
        }

        
        const {username} = result.data

      const existingVerifieduser = await UserModel.findOne({userName: username , isVerified: true})

      if(existingVerifieduser){
        return Response.json({
                success: false,
                message: 'Username is already in use.',
            },
        {status:400})
      }

        return Response.json({
                success: true,
                message: 'Username is available.',
                
            },
        {status:200})
    }catch(error){
        console.error('Error checking username uniqueness:', error);
        return Response.json({
            success: false,
            message: 'An error occurred while checking username uniqueness.'
        },
     {status:500}
    )
    }
}