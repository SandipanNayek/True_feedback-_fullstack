'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import {
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  UserCircle2,
} from 'lucide-react'

function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as User | undefined

  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

        {/* Logo */}

        <Link href="/" className="group">
          <h1 className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-3xl font-extrabold text-transparent transition group-hover:scale-105">
            True Feedback
          </h1>
        </Link>

        {/* Desktop */}

        <div className="hidden items-center gap-4 md:flex">

          {session ? (
            <>
              <Link href="/dashboard">
                <Button className="rounded-xl bg-cyan-500 px-6 hover:bg-cyan-600">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>

              <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-800 px-3 py-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500">

                  <UserCircle2 className="h-6 w-6 text-white" />

                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Welcome
                  </p>

                  <p className="font-semibold text-white">
                    {user?.userName || user?.email}
                  </p>
                </div>

              </div>

              <Button
                onClick={() => signOut()}
                variant="outline"
                className="rounded-xl border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="rounded-xl bg-cyan-500 hover:bg-cyan-600">
                Login
              </Button>
            </Link>
          )}

        </div>

        {/* Mobile Button */}

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-white transition hover:bg-slate-800 md:hidden"
        >
          {open ? (
            <X className="h-7 w-7" />
          ) : (
            <Menu className="h-7 w-7" />
          )}
        </button>

      </div>

      {/* Mobile Menu */}

      {open && (
        <div className="border-t border-slate-700 bg-slate-950 md:hidden">

          {session ? (
            <div className="space-y-4 p-5">

              <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-3">

                <UserCircle2 className="h-10 w-10 text-cyan-400" />

                <div>
                  <p className="text-sm text-slate-400">
                    Logged in as
                  </p>

                  <p className="font-semibold text-white">
                    {user?.userName || user?.email}
                  </p>
                </div>

              </div>

              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
              >
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  setOpen(false)
                  signOut()
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>

            </div>
          ) : (
            <div className="p-5">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
              >
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
                  Login
                </Button>
              </Link>
            </div>
          )}

        </div>
      )}
    </nav>
  )
}

export default Navbar