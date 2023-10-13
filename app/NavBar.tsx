'use client'
import {useSession} from 'next-auth/react'
import Link from 'next/link'

export default function NavBar() {
  const {status, data: session} = useSession()

  return (
    <div className="flex bg-slate-200 p-5 space-x-3">
      <Link data-cy="navbar-home-link" href="/" className="mr-5">
        Home
      </Link>
      <Link data-cy="navbar-users-link" href="/users" className="mr-5">
        Users
      </Link>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'authenticated' && <div>{session.user!.name}</div>}
      {status === 'unauthenticated' && (
        <Link data-cy="navbar-sign-in" href="/api/auth/signin" className="mr-5">
          Login
        </Link>
      )}
    </div>
  )
}
