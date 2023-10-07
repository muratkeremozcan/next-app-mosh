// 'use server' // Cannot find module 'react-server-dom-webpack/client' https://github.com/cypress-io/cypress/issues/27890
import {Suspense} from 'react'
import type {User} from './schema'
import UsersTable from './UsersTable'
import Link from 'next/link'

type UsersPageProps = {
  // to access query string parameters
  // we use `searchParams` object as a prop in the component
  searchParams: {
    sortOrder: string
  }
}

export default async function UsersPage({
  searchParams: {sortOrder},
}: UsersPageProps) {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    // if we leave out the optional arg, nextJs caches by default
    cache: 'no-store', // if data changes frequently, don't use cache
    // we can keep the data cached for a certain period of time, and revalidate periodically
    // next: {
    //   revalidate: 10,
    // },
  })
  const users: User[] = await res.json()

  return (
    <>
      <h1>Users</h1>
      <Link data-cy="new-user" href="/users/new" className="btn">
        New User
      </Link>
      <Suspense fallback={<div>Loading...</div>}>
        <UsersTable users={users} sortOrder={sortOrder} />
      </Suspense>
    </>
  )
}
