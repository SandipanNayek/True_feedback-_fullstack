'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { LayoutDashboard } from 'lucide-react'

function Navbar() {
  const { data: session } = useSession()

  const user = session?.user as User | undefined

  return (
   <nav className="w-full border-b border-slate-700 bg-slate-900 shadow-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-5">

        {/* Logo */}

        <Link
          href="/"
          className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl font-extrabold text-transparent"
        >
          True Feedback
        </Link>

        {session ? (
          <div className="flex items-center gap-4">

            {/* Dashboard */}

            <Link href="/dashboard">
              <Button className="h-11 rounded-xl bg-cyan-500 px-6 text-base hover:bg-cyan-600">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>

            {/* Username */}

            <span className="hidden rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-base font-medium text-white md:block">
              Welcome,&nbsp;
              <span className="font-bold text-cyan-400">
                {user?.userName || user?.email}
              </span>
            </span>

            {/* Logout */}

            <Button
              onClick={() => signOut()}
              variant="outline"
              className="h-11 rounded-xl border-slate-600 bg-slate-100 px-6 text-base font-semibold text-black hover:bg-slate-200"
            >
              Logout
            </Button>

          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              className="h-11 rounded-xl bg-cyan-500 px-6 text-base hover:bg-cyan-600"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar