// 'use server' // Cannot find module 'react-server-dom-webpack/client' https://github.com/cypress-io/cypress/issues/27890
import type {User} from './types'
import UsersTable from './UsersTable'

type UsersPageProps = {
  searchParams: {sortOrder: string}
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
      <UsersTable users={users} sortOrder={sortOrder} />
    </>
  )
}
