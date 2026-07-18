'use client'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import {toast} from 'sonner'
import * as z from "zod"
import {Controller, useForm} from 'react-hook-form'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import {
  Field,
  FieldLabel, 
} from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
export default function VerifyAccount  ()  {
    const router = useRouter()
    const params = useParams<{username : string}>()

    const form = useForm<z.infer<typeof verifySchema>>({
          resolver: zodResolver(verifySchema),
          defaultValues: {
            code: "",
          },
        })

        const onSubmit = async (data: z.infer<typeof verifySchema>) => {
            try {
              const response =  await axios.post<ApiResponse>(`/api/verify-code`,{
                    userName: params.username,
                    code: data.code
                })
                console.log(response.status);
              console.log(response.data);

              toast.success(response.data.message);

              console.log("Redirecting...");
              router.replace("/sign-in");
            } catch (error) { 
                const axiosError = error as AxiosError<ApiResponse>;
                const errorMessage = axiosError.response?.data.message ?? "Something went wrong"
                toast.error("Verification  failed", {
                description: errorMessage,
                });
              } 
            }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
            <Controller
              name="code"
              control={form.control}
              render={({ field }) => (
                <Field >
                  <FieldLabel className="text-lg font-bold tracking-wide text-slate-800">Verification Code</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter verification code"
                    className="h-12 px-4 text-lg "
                  />
                  {form.formState.errors.code && (
                    <p className="mt-2 text-sm text-red-500">
                      {form.formState.errors.code.message}
                    </p>
                  )}
                </Field>
              )}
            />
            <Button className="w-full h-12 text-base font-semibold" type="submit">Verify</Button>
        </form>
      </div>
    </div>
  )
}


