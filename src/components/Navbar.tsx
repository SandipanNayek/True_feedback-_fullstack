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
} from 'lucide-react'

function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as User | undefined

  const [open, setOpen] = useState(false)

  return (
    <nav className="w-full border-b border-slate-700 bg-slate-900 shadow-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-5">

        {/* Logo */}

        <Link
          href="/"
          className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl"
        >
          True Feedback
        </Link>

        {/* Desktop */}

        <div className="hidden items-center gap-4 md:flex">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>

              <span className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-white">
                Welcome,&nbsp;
                <span className="font-bold text-cyan-400">
                  {user?.userName || user?.email}
                </span>
              </span>

              <Button
                variant="outline"
                onClick={() => signOut()}
                className="bg-white text-black hover:bg-gray-200"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
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
        <div className="border-t border-slate-700 bg-slate-900 md:hidden">

          {session ? (
            <div className="space-y-4 p-5">

              <p className="text-center text-lg text-white">
                Welcome
              </p>

              <p className="break-all text-center font-semibold text-cyan-400">
                {user?.userName || user?.email}
              </p>

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
                onClick={() => {
                  setOpen(false)
                  signOut()
                }}
                variant="outline"
                className="w-full bg-white text-black hover:bg-gray-200"
              >
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