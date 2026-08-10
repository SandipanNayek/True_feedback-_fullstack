'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const Page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [debouncedUsername] = useDebounceValue(username, 300)

  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

 useEffect(() => {
  const checkUsernameUnique = async () => {
    if (!debouncedUsername) {
      setUsernameMessage("")
      setIsCheckingUsername(false)
      return
    }

    setIsCheckingUsername(true)
    setUsernameMessage("")

    try {
      const response = await axios.get(
        `/api/check-username-unique?username=${encodeURIComponent(debouncedUsername)}`
      )

      setUsernameMessage(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      setUsernameMessage(
        axiosError.response?.data.message ?? "Error checking username"
      )
    } finally {
      setIsCheckingUsername(false)
    }
  }

  checkUsernameUnique()
}, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data)

      toast.success("Success", {
        description: response.data.message,
      })

      router.replace(`/verify/${encodeURIComponent(data.username)}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error("Signup Failed", {
        description:
          axiosError.response?.data.message ?? "Something went wrong",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Join True Feedback
          </h1>

          <p className="mb-6  text-gray-600 sm:text-[17px]">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-base font-semibold tracking-wide text-slate-800 sm:text-lg">
                    Username
                  </FieldLabel>

                  <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setUsername(e.target.value)
                      }}
                      placeholder="Enter your username"
                      className="h-12 px-4 text-base placeholder:text-[16px] sm:text-lg sm:placeholder:text-[17px]"
                    />

                  {isCheckingUsername && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking username...</span>
                    </div>
                  )}

                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`mt-2 break-words text-sm ${
                        usernameMessage === "Username is available."
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}

                  {form.formState.errors.username && (
                    <p className="mt-2 text-sm text-red-500">
                      {form.formState.errors.username.message}
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
                  <FieldLabel className="text-base font-semibold tracking-wide text-slate-800 sm:text-lg">
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    placeholder="Enter your email"
                    className="h-12 px-4 text-base placeholder:text-[16px] sm:text-lg sm:placeholder:text-[17px]"
                  />

                  {form.formState.errors.email && (
                    <p className="mt-2 text-sm text-red-500">
                      {form.formState.errors.email.message}
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
            className="h-12 w-full text-base font-semibold sm:text-lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm sm:text-[17px]">
          <p>
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page