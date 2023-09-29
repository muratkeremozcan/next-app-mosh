## Lesson1

App routing is setup under `./app`

By default all components in the `./app` folder are server components. If we
want to make them client components, `use client`

### Why use server components?

We want to keep as much components in the server as possible, because we want
things

- faster
- more secure
- to have better search engine optimization.

There is also the problem of extra round trip with client side rendering.

- 1st round: html, css, css is downloaded
- 2nd round: extra request is sent to fetch data from the server

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gpt41rm6plizwtdk48tl.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3q5m0pal2dzmm8lt1rn9.png)

### Fetching on the client vs fetching on the server

In a traditional React application (without server components like in Next.js):

1. An API endpoint would be set up (e.g., `POST /api/todos`).

2. The React component would send an HTTP POST request to this endpoint upon
   form submission.

3. The server would process the request, validate the data, and interact with
   the database to create a new todo.

4. After processing, the server sends back a response (e.g., newly created todo
   or a success message).

5. The React component handles this response, updating the local state or
   redirecting the user as necessary.

This traditional approach ensures a clear separation of frontend and backend
logic, and is suitable for various hosting solutions. However, it can also
introduce more boilerplate, additional round trips to the server, and potential
latency.

With Next.js and its server component feature, some of these steps are
streamlined

- No explicit api endpoints
- No need to create explicit API endpoints; server-side functions can be
  directly called from components.
- Automatic handling of data serialization, reducing manual processing (no
  JSON.stringify or JSON.parse).
- Data fetching is optimized and closer to the UI, reducing over-fetching.
- Can reduce the number of round trips to the server, as you can perform
  operations and return updated UI in one go.
- Unified error handling without needing to split logic between an API endpoint
  and client code.
- A more integrated development experience blending server and client logic.

Whenever fetching data, we should prefer server components.

### Server component vs client component 1:1

In a server-side component the server doesn't send the response until the data
is fetched and ready, so there's no "loading" state from the user's perspective;
it's instant.

```tsx
type User = {
  id: number
  name: string
}

export default async function UsersPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  const users: User[] = await res.json()

  return (
    <>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  )
}
```

When you shift to client-side fetching, the component renders, and the data
fetching occurs in the background after the initial render. Hence, there's a
period where data is still being fetched, which is what the `isLoading` state
represents.

Additionally, since the fetching is happening on the client side, there's a
chance of errors due to network issues, server errors, etc. Thus, the `isError`
state becomes useful to inform the user when something goes wrong. We have to
have a custom hook to fetch the data, and have error checking in it.

```ts
// hooks/useUsers.ts
import {useQuery} from 'react-query'

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')

  // we have to have error checking
  // because the client can fail to fetch
  if (!res.ok) throw new Error('Network response was not ok')

  return res.json()
}

// react-query handles caching with the cache key: 'users'
export const useUsers = () => useQuery('users', fetchUsers)
```

We have to manage isLoading and isError states to improve the user experience.

```tsx
import {useUsers} from '../hooks/useUsers'

type User = {
  id: number
  name: string
}

export default function UsersPage() {
  const {data: users, isLoading, isError} = useUsers()

  // we have to have intermediate states for loading
  // and potential error
  // to improve the user experience
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError || !users) {
    return <div>Error loading users...</div>
  }

  // this part is the same
  return (
    <>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  )
}
```

### When do we still need client components?

We still have to spot-use client components, because server components cannot:

- Listen to browser events
- Access browser APIs
- Maintain state
- Use effects

Ex: `AddToCart` is minuscule part of `ProductCard` and has to be a client
component because it needs an `onClick` event.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/79tm3mk3ud0w0kjxasx6.png)

### Caching

Data sources to get data from (slower the further down):

- Memory
- File system
- Network

NextJS has built-in caching. We can turn it off, or revalidate every n seconds

```ts
const res = await fetch('https://jsonplaceholder.typicode.com/users', {
  // if we leave out the optional arg, nextJs caches by default
  // cache: 'no-store', // if data changes frequently, don't use cache
  // we can keep the data cached for a certain period of time,
  // and revalidate periodically
  next: {
    revalidate: 10,
  },
})
```

> For comparison, `react-query` handles caching with the cache key: 'users'
>
> ```ts
> export const useUsers = () => useQuery('users', fetchUsers)
> ```

### Static site generation vs Server side rendering

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c8cm6suvt1j0yoftr81g.png)

If we have pages with static data, we can render at build time. No need to
re-render them later.

In contrast, dynamic rendering is at request time.

If we had something like this, in development mode time would update, but in
production mode it would never change.

```tsx
<>
  <h1>Users</h1>
  <p>{new Date().toLocaleTimeString()}</p>
  <ul>
    {users.map(user => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
</>
```

`npm run build && npm start` for production mode. After build, it will show us
that the sites are static, they will never update for users.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vcps2uiq7202jb8xg42w.png)

If we specify no cache, then it would not be a static page, but instead be
server side rendered (SSR).

```tsx
const res = await fetch('https://jsonplaceholder.typicode.com/users', {
  cache: 'no-store',
})
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1gq0ghejoy3toqp73cjk.png)

## Styles

### CSS modules

Name the file `foo.module.css.`

Use camel case for class names.

Import and use:

```css
// app/components/ProductCard.module.css
.card {
  padding: 1rem;
  border: 1px solid #ccc;
}
```

```tsx
// app/components/ProductCard.tsx
import AddToCart from './AddToCart'
import styles from './ProductCard.module.css'

export default function ProductCard() {
  return (
    <div className={styles.card}>
      <AddToCart />
    </div>
  )
}
```

### Tailwind

https://tailwindcss.com/docs/customizing-colors

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/skkimhbu299gqyxj8yro.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iszczzwf8uvgmas5dnnm.png)

With Tailwind, we do not have to clean up our css, only what gets used gets
bundled.

```tsx
import AddToCart from './AddToCart'

export default function ProductCard() {
  return (
    <div className="p-5 m-5 bg-sky-400 text-white text-xl hover:bg-sky-500">
      <AddToCart />
    </div>
  )
}
```

### daisyUI (bootstrap for Tailwind)

Install and add to plugins in `tailwind.config.css`.

To use themes, add a daisy property with themes.

```js
plugins: [require('daisyui')],
daisyui: {
  themes: ['winter'],
},
```

Apply the theme globally at `layout.tsx`

```tsx
// ./app/layout.tsx
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" data-theme="winter">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

## Routing and Navigation

Any folder under app (except `components`) creates a route.

### Dynamic route

A route with a parameter. The syntax is like so.

Ex: `/users/2/`

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pu7lkbsi6daoasw974pp.png)

```tsx
// ./app/users/[id]/page.tsx
type UserDetailsPageProps = {
  params: {
    id: number
  }
}

export default function UserDetailPage({params: {id}}: UserDetailsPageProps) {
  return <div>UserDetailPage {id}</div>
}
```

If we wanted a route with nested parameters, we would nest the folders in turn.

Ex: `/users/2/photos/5`

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iwm9kabg5z8m9of7cgn7.png)

```tsx
// ./app/users/[id]/photos/[photoId]/page.tsx
type PhotosDetailsPageProps = {
  params: {
    id: number
    photoId: number
  }
}

export default function PhotoDetailPage({
  params: {id, photoId},
}: PhotosDetailsPageProps) {
  return (
    <div>
      User {id}, PhotoDetailPage {photoId}
    </div>
  )
}
```

