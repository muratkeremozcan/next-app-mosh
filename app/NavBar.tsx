import Link from 'next/link'
import React from 'react'

export default function NavBar() {
  return (
    <div className="flex bg-slate-200 p-5 space-x-3">
      <Link data-cy="navbar-home-link" href="/" className="mr-5">
        Home
      </Link>
      <Link data-cy="navbar-users-link" href="/users" className="mr-5">
        Users
      </Link>
      <Link data-cy="navbar-sign-in" href="/api/auth/signin" className="mr-5">
        Login
      </Link>
    </div>
  )
}
