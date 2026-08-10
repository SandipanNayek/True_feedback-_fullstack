'use client'

import React, { useCallback, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Loader2,
  RefreshCcw,
  Copy,
  Link2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'

import { toast } from 'sonner'

import MessageCard from '@/components/MessageCard'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'

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
      prev.filter(
        (message) => message._id.toString() !== messageId
      )
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
          'Failed to fetch settings'
      )
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true)

      try {
        const response = await axios.get<ApiResponse>(
          '/api/get-messages'
        )

        setMessages(response.data.messages || [])

        if (refresh) {
          toast.success('Messages refreshed')
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

    toast.success('Profile link copied!')
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
          'Settings updated successfully'
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error(
        axiosError.response?.data.message ??
          'Failed to update settings'
      )
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-xl font-semibold text-white">
        Please login first.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-5 py-12">

      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">

          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-5xl font-extrabold text-transparent">

            True Feedback Dashboard

          </h1>

          <p className="mt-4 text-xl text-slate-300">

            Welcome back 👋

          </p>

          <p className="text-slate-500">

            Manage your anonymous messages

          </p>

        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-2">

          <Card className="rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl">

            <CardContent className="flex items-center justify-between p-8">

              <div>

                <p className="text-lg text-slate-400">

                  Total Messages

                </p>

                <h2 className="mt-3 text-5xl font-bold text-cyan-400">

                  {messages.length}

                </h2>

              </div>

              <MessageSquare className="h-16 w-16 text-cyan-400" />

            </CardContent>

          </Card>

          <Card className="rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl">

            <CardContent className="flex items-center justify-between p-8">

              <div>

                <p className="text-lg text-slate-400">

                  Accepting Messages

                </p>

                <h2
                  className={`mt-3 text-5xl font-bold ${
                    acceptMessages
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {acceptMessages ? 'ON' : 'OFF'}
                </h2>

              </div>

              <ShieldCheck className="h-16 w-16 text-green-400" />

            </CardContent>

          </Card>

        </div>
                {/* Profile Link */}

                  <Card className="mb-8 rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl">

                    <CardContent className="p-8">

                      <div className="mb-6 flex items-center gap-3">

                        <Link2 className="h-6 w-6 text-cyan-400" />

                      </div>

                      <Card className="mb-8 rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl">
            <CardContent className="space-y-6 p-8">

              <div className="text-center">

                <h2 className="text-3xl font-bold text-white">
                  🎉 Your Public Profile
                </h2>

                <p className="mt-3 text-lg text-slate-400">
                  Share this page with your friends and start receiving anonymous
                  messages.
                </p>

              </div>

              <input
                value={profileUrl}
                readOnly
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-white outline-none"
              />

              <div className="flex flex-wrap justify-center gap-4">

                <Button
                  onClick={copyToClipboard}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  Copy Link
                </Button>

                <Link
                  href={`/u/${userName}`}
                  target="_blank"
                >
                  <Button variant="outline">
                    View Public Profile
                  </Button>
                </Link>

                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={async () => {
                    if (navigator.share) {
                      await navigator.share({
                        title: "True Feedback",
                        text: "Send me anonymous messages!",
                        url: profileUrl,
                      });
                    } else {
                      copyToClipboard();
                    }
                  }}
                >
                  Share Profile
                </Button>

              </div>

            </CardContent>
          </Card>

          </CardContent>

        </Card>

        {/* Settings */}

        <Card className="mb-10 rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl">

          <CardContent className="p-8">

            <div className="mb-8 flex items-center gap-3">

              <ShieldCheck className="h-6 w-6 text-cyan-400" />

              <h2 className="text-2xl font-bold text-white">

                Message Settings

              </h2>

            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-4">

                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />

                <div>

                  <p className="text-lg font-semibold text-white">

                    Accept Anonymous Messages

                  </p>

                  <p
                    className={`font-medium ${
                      acceptMessages
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {acceptMessages
                      ? "Currently ON"
                      : "Currently OFF"}
                  </p>

                </div>

                {isSwitchLoading && (
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                )}

              </div>

              <Button
                onClick={() => fetchMessages(true)}
                disabled={isLoading}
                className="h-12 rounded-xl bg-cyan-500 px-8 text-lg hover:bg-cyan-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="mr-2 h-5 w-5" />
                    Refresh Messages
                  </>
                )}
              </Button>

            </div>

          </CardContent>

        </Card>

        {/* Messages */}

        <div className="mb-8 flex items-center gap-3">

          <MessageSquare className="h-7 w-7 text-cyan-400" />

          <h2 className="text-3xl font-bold text-white">

            Your Messages

          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id.toString()}
                className="transition-all duration-300 hover:-translate-y-1"
              >
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              </div>
            ))
          ) : (
            <Card className="col-span-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 backdrop-blur-xl">

              <CardContent className="flex flex-col items-center justify-center py-20">

                <div className="mb-6 text-7xl">
                  📭
                </div>

                <h3 className="text-3xl font-bold text-white">
                  No Messages Yet
                </h3>

                <p className="mt-4 max-w-xl text-center text-lg text-slate-400">
                  You have not received any anonymous messages yet.
                  Share your public profile link with your friends,
                  classmates and colleagues to start receiving
                  honest feedback.
                </p>

                <Button
                  onClick={copyToClipboard}
                  className="mt-8 rounded-xl bg-cyan-500 px-8 py-6 text-lg hover:bg-cyan-600"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Profile Link
                </Button>

              </CardContent>

            </Card>
          )}

        </div>

      </div>

    </div>
  )
}

export default UserDashboard