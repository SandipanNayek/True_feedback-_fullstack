'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

function Navbar() {
  const { data: session } = useSession()

  const user = session?.user as User | undefined

  return (
 <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-700 bg-slate-900 backdrop-blur-md p-4 text-white shadow-lg md:p-6">
    <div className="container mx-auto flex items-center justify-between">
      
      <Link href="/" className="text-2xl font-bold">
        True Feedback
      </Link>

      {session ? (
        <div className="flex items-center gap-4">
    <span className="hidden md:block text-[17px] font-medium text-white">
            Welcome,&nbsp;
            <span className="font-bold text-cyan-400">
              {user?.userName || user?.email}
            </span>
          </span>

          <Button
            onClick={() => signOut()}
            variant="outline"
            className="h-12 px-8 text-lg font-semibold bg-slate-100 text-black hover:bg-slate-200"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="ml-auto">
          <Link href="/sign-in">
            <Button
              variant="outline"
              className="h-12 px-8 text-lg font-semibold bg-slate-100 text-black hover:bg-slate-200"
            >
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  </nav>
);
}

export default Navbar