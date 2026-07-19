'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import {Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import {
  Field,
  FieldGroup,
  FieldLabel, 
} from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const Page = () => {
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    // zod implementation

    const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues:{
        identifier: "",
        password: ""
      }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
  setIsSubmitting(true);

  try {
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Login Failed", {
        description: result.error,
      });
      return;
    }

    if (result?.ok) {
      toast.success("Login Successful");
      router.replace("/dashboard");
    }
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <FieldGroup>

            <Controller
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-lg font-bold tracking-wide text-slate-800">Email/Username</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter your email/username"
                    className="h-12 px-4 text-lg"
                  />
                  {form.formState.errors.identifier && (
                    <p className="mt-2 text-sm text-red-500">
                      {form.formState.errors.identifier.message}
                    </p>
                  )}
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
         
          <Button
            className="w-full h-12 text-base font-semibold"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
         </form>
         <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


export default Page