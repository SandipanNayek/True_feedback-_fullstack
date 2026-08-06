'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Copy,
  Sparkles,
  Send,
  RefreshCw,
  Link2,
} from "lucide-react";
import { toast } from "sonner";

export default function Page() {
  const params = useParams();
const username = params.username as string;

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/u/${username}`
      : "";

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const copyProfileLink = async () => {
    await navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied.");
  };

  const generateSuggestions = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/suggest-messages", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        const msgs = data.suggestions
          .split("||")
          .map((item: string) => item.trim());

        setSuggestions(msgs);

        toast.success("Suggestions generated.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please write a message.");
      return;
    }

    try {
      setSending(true);

      

          const response = await axios.post("/api/send-messages", {
          username,
          content: message,
        });

        toast.success(response.data.message);

        setMessage("");
    } catch (error: any) {
  console.error(error);

  toast.error(
    error.response?.data?.message || error.message || "Failed to send."
  );

    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-5 py-12">

      <div className="mx-auto max-w-3xl">

        {/* Heading */}

        <div className="mb-10 text-center">

          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-5xl font-extrabold text-transparent">

            True Feedback

          </h1>

          <p className="mt-3 text-lg text-slate-400">

            Honest conversations begin anonymously.

          </p>

        </div>

        {/* Public Link */}

        <Card className="mb-8 rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl">

          <CardContent className="p-8">

            <div className="flex items-center gap-3">

              <Link2 className="h-6 w-6 text-cyan-400" />

              <h2 className="text-2xl font-bold text-white">

                Public Profile Link

              </h2>

            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row">

              <Input
                readOnly
                value={profileUrl}
                className="h-12 rounded-xl border-slate-700 bg-slate-800 text-white"
              />

              <Button
                onClick={copyProfileLink}
                className="h-12 rounded-xl bg-cyan-500 hover:bg-cyan-600"
              >
                <Copy className="mr-2 h-5 w-5" />
                Copy
              </Button>

            </div>

          </CardContent>

        </Card>

        {/* Send Message */}

        <Card className="rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl">

          <CardContent className="space-y-8 p-8">

            <div>

              <h2 className="text-3xl font-bold text-white">

                Send Anonymous Message

              </h2>

              <p className="mt-2 text-lg text-cyan-400">

                @{username}

              </p>

            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your anonymous message here..."
              className="min-h-[180px] rounded-2xl border-slate-700 bg-slate-800 text-lg text-white placeholder:text-slate-500"
            />

            <Button
              onClick={sendMessage}
              disabled={sending}
              className="h-12 w-full rounded-xl bg-blue-600 text-lg hover:bg-blue-700"
            >
              <Send className="mr-2 h-5 w-5" />

              {sending ? "Sending..." : "Send It"}

            </Button>
                        {/* Suggestions Section */}

            <div className="border-t border-slate-700 pt-8">

              <p className="mb-5 text-center text-lg text-slate-300">
                Click on any message below to select it.
              </p>

              <Button
                onClick={generateSuggestions}
                disabled={loading}
                className="mx-auto flex h-12 rounded-xl bg-cyan-500 px-8 text-lg hover:bg-cyan-600"
              >
                <RefreshCw
                  className={`mr-2 h-5 w-5 ${
                    loading ? "animate-spin" : ""
                  }`}
                />

                {loading
                  ? "Generating..."
                  : "Suggest New Messages"}
              </Button>

              <div className="mt-8 space-y-4">

                <h3 className="flex items-center gap-2 text-2xl font-bold text-white">

                  <Sparkles className="h-6 w-6 text-cyan-400" />

                  Messages

                </h3>

                {suggestions.length > 0 ? (
                  suggestions.map((item, index) => (
                    <Card
                      key={index}
                      onClick={() => {
                        setMessage(item);
                        toast.success(
                          "Suggestion added to message box."
                        );
                      }}
                      className="cursor-pointer rounded-2xl border border-slate-700 bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-slate-700 hover:shadow-xl"
                    >
                      <CardContent className="flex items-start gap-4 p-5">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-white">

                          {index + 1}

                        </div>

                        <p className="text-lg leading-8 text-slate-200">

                          {item}

                        </p>

                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="rounded-2xl border border-dashed border-slate-700 bg-slate-900">

                    <CardContent className="py-16 text-center">

                      <Sparkles className="mx-auto mb-4 h-12 w-12 text-cyan-400" />

                      <h3 className="text-2xl font-bold text-white">

                        No Suggestions Yet

                      </h3>

                      <p className="mt-3 text-lg text-slate-400">

                        Click the button above to generate
                        AI-powered conversation starters.

                      </p>

                    </CardContent>

                  </Card>
                )}

              </div>

            </div>

          </CardContent>

        </Card>

        {/* Bottom CTA */}

        <div className="mt-10 rounded-3xl border border-slate-700 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-8 text-center backdrop-blur-xl">

          <h2 className="text-3xl font-bold text-white">

            Get Your Message Board

          </h2>

          <p className="mt-3 text-lg text-slate-300">

            Join True Feedback and receive anonymous messages
            from your friends, classmates and colleagues.

          </p>

          <Button
            className="mt-8 h-12 rounded-xl bg-cyan-500 px-10 text-lg hover:bg-cyan-600"
          >
            Create Your Account
          </Button>

        </div>

      </div>

    </div>
  );
}