'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend
} from "@/components/ui/field";
import { Button } from "@/components/ui/button"

const Page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [debouncedUsername] = useDebounceValue(username, 300)
    const router = useRouter()

    // zod implementation

    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues:{
        username:"",
        email:"",
        password:""
      }
    })

    useEffect(()=>{ 
       const checkUsernameUnique = async () => {
         if (debouncedUsername) {
           setIsCheckingUsername(true)
           setUsernameMessage('')
           try{
            const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
            setUsernameMessage(response.data.message)
           }catch(error){
              const axiosError = error as AxiosError<ApiResponse>;
              setUsernameMessage(
                axiosError.response?.data.message ?? "Error checking username"
              )
           } finally{
            setIsCheckingUsername(false)
           }
         }
       }
       checkUsernameUnique()
    },[debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
        const response =   await axios.post<ApiResponse>('/api/sign-up' , data)
        toast.success("Success", {
          description: response.data.message,
          duration: 3000,
        });
        router.replace(`/verify/${data.username}`)
        } catch (error) {
          console.log("Error in signup of user ",error )
          const axiosError = error as AxiosError<ApiResponse>;
              const errorMessage = axiosError.response?.data.message ?? "Something went wrong"
              toast.error("Signup failed", {
                 description: errorMessage,
              });
        } finally{
          setIsSubmitting(false)
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Sign Up</FieldLegend>
                <FieldDescription>
                  Create your account.
                </FieldDescription>

                {/* Username Field */}

                {/* Email Field */}

                {/* Password Field */}
              </FieldSet>

              <Button type="submit">
                Sign Up
              </Button>
            </FieldGroup>
         </form>
        

      </div>
    </div>
  )
}


export default Page