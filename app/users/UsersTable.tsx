'use client'
import type {User} from './types'

type UsersTableProps = {
  users: User[]
}

export default function UsersTable({users}: UsersTableProps) {
  return (
    <table data-cy="user-table-comp" className="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr data-cy={`user-${user.id}`} key={user.id}>
            <td data-cy={user.name}>{user.name}</td>
            <td data-cy={user.email}>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
