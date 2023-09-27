'use server'
type User = {
  id: number
  name: string
  email: string
}

export default async function UsersPage() {
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
      <table className="table table-bordered">
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
    </>
  )
}
