'use client'

import React, { useCallback, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')

  const { data: session, status } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.filter((message) => message._id.toString() !== messageId)
    )
  }

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)

    try {
      const response = await axios.get<ApiResponse>(
        '/api/accept-messages'
      )

      setValue(
        'acceptMessages',
        response.data.isAcceptingMessages ?? false
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error(
        axiosError.response?.data.message ??
          'Failed to fetch message settings'
      )
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true)

      try {
        const response = await axios.get<ApiResponse>(
          '/api/get-messages'
        )

        setMessages(response.data.messages || [])

        if (refresh) {
          toast.success('Showing latest messages')
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>

        toast.error(
          axiosError.response?.data.message ??
            'Failed to fetch messages'
        )
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!session?.user) return

    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchMessages, fetchAcceptMessage])

  const userName =
    (session?.user as User | undefined)?.userName

  useEffect(() => {
    if (userName) {
      setProfileUrl(
        `${window.location.origin}/u/${userName}`
      )
    }
  }, [userName])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(profileUrl)

    toast.success('Copied to clipboard')
  }

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(
        '/api/accept-messages',
        {
          isAcceptingMessages: !acceptMessages,
        }
      )

      setValue(
        'acceptMessages',
        !acceptMessages
      )

      toast.success(
        response.data.message ??
          'Message settings updated successfully'
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error(
        axiosError.response?.data.message ??
          'Failed to update message settings'
      )
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex h-screen items-center justify-center text-[17px] font-semibold">
        Please login first.
      </div>
    )
  }
    return (
    <div className="mx-auto my-8 w-full max-w-7xl rounded-xl bg-white p-6 shadow-lg md:p-8">
      <h1 className="mb-8 text-5xl font-bold text-gray-900">
        User Dashboard
      </h1>

      
      <div className="mb-8">
        <h2 className="mb-3 text-[17px] font-semibold text-gray-800">
          Copy Your Unique Link
        </h2>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-[17px] outline-none"
          />

          <Button
            onClick={copyToClipboard}
            className="h-12 px-8 text-[17px] font-semibold"
          >
            Copy
          </Button>
        </div>
      </div>

      
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />

          <span className="text-[17px] font-medium">
            Accept Messages :
          </span>

          <span
            className={`text-[17px] font-semibold ${
              acceptMessages
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {acceptMessages ? "On" : "Off"}
          </span>

          {isSwitchLoading && (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
        </div>

        <Button
          variant="outline"
          className="h-12 gap-2 text-[17px] font-semibold"
          onClick={() => fetchMessages(true)}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCcw className="h-5 w-5" />
              Refresh Messages
            </>
          )}
        </Button>
      </div>

      <Separator />

      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
            <p className="text-[17px] font-medium text-gray-500">
              No messages to display.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard