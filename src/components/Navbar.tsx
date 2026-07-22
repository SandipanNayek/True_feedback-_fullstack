'use client'

import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'

function Navbar() {
    const {data: session} = useSession()

    const user:User = session?.user as User

return (
  <nav className="border-b bg-white shadow-sm">
    <div className="container mx-auto flex h-16 items-center justify-between px-6">
      <Link
        href="/"
        className="text-2xl font-bold tracking-wide text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        Mystery Message
      </Link>

      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Welcome,{" "}
            <span className="text-indigo-600">
              {user?.userName || user?.email}
            </span>
          </span>

          <Button
            variant="destructive"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
      ) : (
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
      )}
    </div>
  </nav>
  );
}


export default Navbar