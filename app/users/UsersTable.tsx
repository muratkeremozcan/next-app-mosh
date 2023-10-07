// 'use client' // this could be a client component, but nothing really requires it:
// we don't need to listen to browser events, access browser apis, maintain state or use effects
// so we take advantage of server component benefits:
// smaller bundle, resource efficient, SEO, more secure
import Link from 'next/link'
import type {User} from '../api/users/schema'
import {sort} from 'fast-sort'

type UsersTableProps = {
  users: User[]
  sortOrder?: string
}

export default function UsersTable({
  users,
  sortOrder = 'name',
}: UsersTableProps) {
  // fast-sort lib gives convenience for sorting data
  const sortedUsers = sort(users).asc(
    sortOrder === 'email' ? user => user.email : user => user.name,
  )

  return (
    <table data-cy="user-table-comp" className="table table-bordered">
      <thead>
        <tr>
          {/* we use next/link instead of <a> to take advantage client-side navigation (caching) */}
          <th>
            <Link data-cy="sort-by-name" href="/users?sortOrder=name">
              Name
            </Link>
          </th>
          <th>
            <Link data-cy="sort-by-email" href="users?sortOrder=email">
              Email
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedUsers.map(user => (
          <tr data-cy={`user-${user.id}`} key={user.id}>
            <td data-cy={user.name}>{user.name}</td>
            <td data-cy={user.email}>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
