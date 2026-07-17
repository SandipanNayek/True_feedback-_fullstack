'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import {Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue , useDebounceCallback} from 'usehooks-ts'
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
  FieldLegend,
  
} from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

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
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-lg font-bold tracking-wide text-slate-800">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setUsername(e.target.value)
                    }}
                    placeholder="Enter your username"
                    className="h-12 px-4 text-lg"
                  />
                  {isCheckingUsername && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Checking username...</span>
                        </div>
                    )}

                    {!isCheckingUsername && usernameMessage && (
                        <p
                        className={`mt-2 text-sm ${
                            usernameMessage === "Username is available."
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                        >
                        {usernameMessage}
                        </p>
                    )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-lg font-bold tracking-wide text-slate-800">Email</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    className="h-12 px-4 text-lg"
                  />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-lg font-bold tracking-wide text-slate-800">Password</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter your Password"
                    type="password"
                    className="h-12 px-4 text-lg"
                  />
                  {form.formState.errors.password && (
                    <p className="mt-2 text-sm text-red-500">
                        {form.formState.errors.password.message}
                    </p>
                    )}
               </Field>
              )}
            />
            </FieldGroup>
         
        <Button className="w-full h-12 text-base font-semibold" type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
              </>
            ) : ('Signup')
          }
        </Button>
         </form>
         <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


export default Page