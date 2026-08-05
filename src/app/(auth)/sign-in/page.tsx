'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)

    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Login Failed", {
          description: result.error,
        })
        return
      }

      if (result?.ok) {
        toast.success("Login Successful")
        router.replace("/dashboard")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Welcome Back
          </h1>

          <p className="mb-6  text-gray-600 sm:text-[17px]">
            Sign in to continue your secret conversations
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-base font-semibold tracking-wide text-slate-800 sm:text-lg">
                    Email / Username
                  </FieldLabel>

                  <Input
                    {...field}
                    placeholder="Enter your email or username"
                    className="h-12 px-4 text-base placeholder:text-[16px] sm:text-lg sm:placeholder:text-[17px]"
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
                  <FieldLabel className="text-base font-semibold tracking-wide text-slate-800 sm:text-lg">
                    Password
                  </FieldLabel>

                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 px-4 text-base placeholder:text-[16px] sm:text-lg sm:placeholder:text-[17px]"
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
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full text-base font-semibold sm:text-lg"
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
        

        <div className="mt-6 text-center text-sm sm:text-[17px]">
          <p>
            Not a member?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page