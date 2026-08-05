'use client'

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"

function Home() {
  const [loading, setLoading] = React.useState(true);

React.useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1500);

  return () => clearTimeout(timer);
}, []);
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-4">

        {/* Hero */}
        <section className="mb-4 max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            Dive into the World of
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Anonymous Feedback
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-[17px] leading-7 text-gray-300">
            True Feedback is a platform where your identity remains a secret.
            Share your profile and receive honest anonymous feedback from
            friends, colleagues and anyone who wants to help you grow.
          </p>
        </section>

        
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-2xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="h-[220px] rounded-2xl border border-slate-700 bg-slate-800 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

                    <CardHeader className="border-b border-slate-700 py-3">
                      {loading ? (
                        <>
                          <Skeleton className="h-5 w-2/3" />
                          <Skeleton className="mt-2 h-4 w-1/2" />
                        </>
                      ) : (
                        <h2 className="text-[17px] font-bold text-cyan-400">
                          {message.title}
                        </h2>
                      )}
                    </CardHeader>
                    <CardContent className="flex h-[140px] flex-col justify-between p-5">
                      {loading ? (
                        <>
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-700 pt-3">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-[17px] leading-7 text-gray-300">
                            {message.content}
                          </p>

                          <div className="flex items-center justify-between border-t border-slate-700 pt-3">
                            <span className="text-[17px] font-semibold text-cyan-400">
                              Anonymous
                            </span>

                            <span className="text-[15px] text-gray-400">
                              Just now
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 py-4 text-center">
        <p className="text-[17px] text-gray-300">
          © {new Date().getFullYear()} True Feedback. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default Home