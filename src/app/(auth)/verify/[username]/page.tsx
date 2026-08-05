'use client'

import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import * as z from "zod"
import { Controller, useForm } from 'react-hook-form'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

import {
  Field,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function VerifyAccount() {
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        userName: params.username,
        code: data.code,
      })

      toast.success(response.data.message)

      router.replace("/sign-in")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error("Verification Failed", {
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
            Verify Your Account
          </h1>

          <p className="mb-6  text-gray-600 sm:text-[17px]">
            Enter the verification code sent to your email.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Controller
            name="code"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel className="text-base font-semibold tracking-wide text-slate-800 sm:text-lg">
                  Verification Code
                </FieldLabel>

                <Input
                  {...field}
                  placeholder="Enter verification code"
                  className="h-12 px-4 text-base placeholder:text-[16px] sm:text-lg sm:placeholder:text-[17px]"
                />

                {form.formState.errors.code && (
                  <p className="mt-2 text-sm text-red-500">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full text-base font-semibold sm:text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}