type User = {
  id: number
  name: string
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
      <p>{new Date().toLocaleTimeString()}</p>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  )
}
