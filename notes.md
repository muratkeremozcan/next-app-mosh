## Lesson1

App routing is setup under `./app`

By default all components in the `./app` folder are server components. If we
want to make them client components, `'use client'` at the top of the file.

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

1. No need to create explicit API endpoints; server-side functions can be
   directly called from components (1, 3, 4 above)
2. Data fetching is optimized; you still need send a request (2 above):
   - Reduces the number of round trips to the server, as you can perform
     operations and return updated UI in one go.
   - Automatic handling of data serialization, reducing manual processing (no
     JSON.stringify or JSON.parse).
   - Unified error handling without needing to split logic between an API
     endpoint and client code.
3. No need to manage state in a server component (5 above), however, once they
   are rendered, their output doesn't reactively update in response to changes
   like client components.

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

Use the `params` object (as a prop) in the component to utilize dynamic routes.

```tsx
// ./app/users/[id]/page.tsx

// single param case for dynamic route;
// use the `params` object (as a prop) in the component to utilize it.
type UserDetailsPageProps = {
  params: {
    id: number
  }
}

export default function UserDetailPage({params: {id}}: UserDetailsPageProps) {
  return <div>UserDetailPage {id}</div>
}
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vvi62a1k70r5t3o50gaf.png)

If we wanted a route with nested parameters, we would nest the folders in turn.

Ex: `/users/2/photos/5`

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iwm9kabg5z8m9of7cgn7.png)

Multiple params case, where params object has all the parameters we are using:

```tsx
// ./app/users/[id]/photos/[photoId]/page.tsx

// multiple params case for dynamic route,
// where params object has all the parameters we are using
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

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x8j7cvffybd5anjvp28d.png)

### Catch-all segments (varying number of parameters in a route)

Let's say we do not know what the parameters might be, they vary.

`/products/grocery/dairy/milk`

We use the `...` syntax (similar to object de-structuring) with the parameter
syntax `[ ]`. And, to make the varying parameters optional, we have another set
of brackets `[[... ]]` . This way, the `/products` portion of
/`products/everythingElse` works by itself

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/alp8t1ed6xlek0hzt99u.png)

```tsx
// ./app/products/[[...slug]]/page.tsx

// Dynamic route + catch all segment
// for catch-all segments, the convention is to name the param "slug"
type ProductPageProps = {
  params: {
    slug: string[]
  }
}

export default function ProductPage({params: {slug}}: ProductPageProps) {
  return <div>ProductPage {slug}</div>
}
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7kovjd8qr61gryeb79cx.png)

### Accessing query string parameters

To access query string parameters, we use `searchParams` object as a prop in the
component

```tsx
// ./app/products/[[...slug]]/page.tsx

// Dynamic route + catch-all segment + query string param:
type ProductPageProps = {
  params: {
    // for catch-all segments, the convention is to name the param "slug"
    slug: string[]
  }
  // to access query string parameters
  // we use `searchParams` object as a prop in the component
  searchParams: {
    sortOrder: string
  }
}

export default function ProductPage({
  params: {slug},
  searchParams: {sortOrder},
}: ProductPageProps) {
  return (
    <div>
      ProductPage {slug}, SortOrder {sortOrder}
    </div>
  )
}
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6we5du9ji3a23xled3lq.png)

### Using query-string parameters for managing (server side) state

Let's say we want to sort users by name or email in the `UsersTable` component.

In a typical client-side application using React, you'd approach this problem by
maintaining a state for the `sortOrder` and modifying it based on user actions
(e.g., button/link clicks). Here's a general idea:

1. Use React state to maintain the `sortOrder`.
2. Add click handlers to modify this state when sorting links are clicked.
3. Use the state value to sort the data when rendering.

Let's write the component in a client-side React context:

```tsx
import React, {useState} from 'react'
import type {User} from './types'
import {sort} from 'fast-sort'

type UsersTableProps = {
  users: User[]
}

export default function UsersTable({users}: UsersTableProps) {
  const [sortOrder, setSortOrder] = useState('name') // default sort order to 'name'

  const sortedUsers = sort(users).asc(
    sortOrder === 'email' ? user => user.email : user => user.name,
  )

  const handleSort = (order: string) => {
    setSortOrder(order)
  }

  return (
    <table data-cy="user-table-comp" className="table table-bordered">
      <thead>
        <tr>
          <th>
            <a
              data-cy="sort-by-name"
              href="#"
              onClick={() => handleSort('name')}
            >
              Name
            </a>
          </th>
          <th>
            <a
              data-cy="sort-by-email"
              href="#"
              onClick={() => handleSort('email')}
            >
              Email
            </a>
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
```

Key differences from the upcoming Next.js version:

1. We're using React's `useState` to handle the `sortOrder` state.
2. Instead of the `Link` component, we're using a regular `<a>` tag with an
   `onClick` handler to change the `sortOrder`.
3. We're preventing the default behavior of the `<a>` tag to avoid page reload
   using `href="#"`.

**How would we do the same in Next.js (sort users by name or email in the
`UsersTable` component)?**

We can take advantage of the combination of how Next.js handles client-side
navigation and the way data fetching works in Next.js.

When we use the `Link` component in Next.js (instead of an `<a>` tag), clicking
the link doesn't lead to a full-page reload (thanks to client-side navigation).
Instead, Next.js fetches just the required data for the new page (or in this
case, the new query string parameter) and updates the page using React's
re-rendering.

1. The browser URL is updated to `/users?sortOrder=name` or `email` without a
   full page reload.
2. The data is fetched and sorted accordingly based on the `sortOrder` query
   parameter.
3. The UI is (re)rendered with the sorted data.

At `UsersPage` parent component, we already have the `users` data.

At child `UsersTable` component, we click Name or Email, and the `sortOrder` is
determined with the url we are on; `href=/users?sortOrder=name`.

At this point we have sorted data, and we just render it.

```tsx
// ./app/users/page.tsx

import type {User} from './types'
import UsersTable from './UsersTable'

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
    cache: 'no-store',
  })
  const users: User[] = await res.json()

  return (
    <>
      <h1>Users</h1>
      <UsersTable users={users} sortOrder={sortOrder} />
    </>
  )
}
```

```tsx
// ./app/users/UsersTable.tsx

// 'use client' // this could be a client component, but nothing really requires it:
// we don't need to listen to browser events, access browser apis, maintain state or use effects
// so we take advantage of server component benefits:
// smaller bundle, resource efficient, SEO, more secure
import Link from 'next/link'
import type {User} from './types'
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
```

With this approach, in contrast to a client side application where we would have
a state for the sort order, have a click event for the click and change the
state onClick we are doing the same at the server using query string parameters.

### Layouts

Layouts are used to create a UI that is shared between multiple pages.

For ex: the `RootLayout` at `./app/layout.tsx` is the common UI for all the app.

Suppose we want a different layout for admin users with a sidebar.

```tsx
// ./app/admin/layout.tsx

import type {ReactNode} from 'react'
import '../globals.css'

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({children}: AdminLayoutProps) {
  return (
    <div className="flex">
      <aside data-cy="admin-sidebar" className="bg-slate-200 p-5 mr-5">
        Admin Sidebar
      </aside>
      <div>{children}</div>
    </div>
  )
}
```

```tsx
// ./app/admin/page.tsx

export default function AdminHomePage() {
  return <div>Admin HomePage</div>
}
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hho6anlx4adw77gtc5yr.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/srhxi1e6uryhwn731t3o.png)

Suppose we want to add a nav bar to all pages. This component could go in
components folder, gut it is only used with `RootLayout` so it is fine at root.

```tsx
// ./app/NavBar.tsx

import Link from 'next/link'
import React from 'react'

export default function NavBar() {
  return (
    <div className="flex bg-slate-200 p-5">
      <Link data-cy="home-link" href="/" className="mr-5">
        Home
      </Link>
      <Link data-cy="users-link" href="/users" className="mr-5">
        Users
      </Link>
    </div>
  )
}
```

We use it in the `RootLayout`, in the `<body>`, above all children. We also wrap
the children in `<main>` for semantic html's sake.

```tsx
// ./app/layout

import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import NavBar from './NavBar'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" data-theme="winter">
      <body className={inter.className}>
        <NavBar />
        <main className="p-5">{children}</main>
      </body>
    </html>
  )
}
```

At global styles, we can override the 3 directives on top with `@layer` and
`@apply`

```css
/* ./app/global.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  padding: 1rem;
}

/* overriding base directive */
@layer base {
  h1 {
    @apply font-extrabold text-2xl mb-3;
  }
}
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ppa3vgyzs20tfnid43sj.png)

### Link

- Only downloads the content of the target page (click on Users link, it only
  downloads the content for Users)

  `rsc` for react server component.

  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/buic7c7jt50me87i906c.png)

- It pre-fetches the links that are in the viewport. We need to run the app in
  production mode to see this:

  `npm run build && npm start` The sort-by links (name and email) are
  pre-fetched to improve performance.

  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/amju4hvrapm569tqd1e9.png)

- Caches pages on the client.

  Nav to Home and Users, clear Network. Repeat, and network will not get
  anything new, because it is cached. The cache resets on a full page reload.

### Programmatic navigation

Click a button, submit a form -> for these we need prog nav.

We use `useRouter` from `next/navigation`, and `.push(/the-route )`.

```tsx
'use client'
// remember, we still need client components when we:
// - Listen to browser events
// - Access browser APIs
// - Maintain state
// - Use effects
import {useRouter} from 'next/navigation'

export default function NewUserPage() {
  const router = useRouter()

  return (
    <button
      data-cy="create"
      className="btn btn-primary"
      onClick={() => router.push('/users')}
    >
      Create
    </button>
  )
}
```

## Showing Loading UIs 

### React Suspense

We can make use of React's Suspense api, wrapping the component that might be loading data.


```tsx
// ./app/users/page.tsx

import {Suspense} from 'react'
import type {User} from './types'
import UsersTable from './UsersTable'
import Link from 'next/link'

type UsersPageProps = {
as a prop in the component
  searchParams: {
    sortOrder: string
  }
}

export default async function UsersPage({
  searchParams: {sortOrder},
}: UsersPageProps) {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    cache: 'no-store', 
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
```

To see it in action, use React dev tools, search for Suspense, and on the right pane click on the clock icon.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dei8ngl7v5rma7rbbdkt.png)

If we want to add Suspense to every component, it can be in the `RootLayout` component, wrapping the children or use the special loading file in NextJs.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f96t13rvrjkczaqi7sus.png)

### Using the `loading.tsx` file

In the case of using `loading.tsx` file, we do not use Suspense. We can place it where we want to loading pages to show. If we put it under app, it will show for everything.

We can use https://daisyui.com/components/loading/ from daisyUI

```tsx
// ./app/loading.tsx

export default function Loading() {
  return (
    <div>
      <span className="loading loading-spinner loading-md"></span>
    </div>
  )
}
```

## Handling Not Found errors

Similar to the `loading.tsx` file, NextJs has a `not-found.tsx` file we can use. The component gets rendered on a page that doesn't exist.

```tsx
// ./app/not-found.tsx

export default function NotFound() {
  return <div>The requested page does not exist</div>
}
```

If we want not found pages specific to the routes, we use the built-in notFound() function. This redirects us to the NotFound page above.

If we want to further customize the not found page on the sub routes, we create `not-found.tsx` files in that route

```tsx
// ./app/users/[id]/page.tsx

// using the built-in notFound component
import {notFound} from 'next/navigation'

type UserDetailsPageProps = {
  params: {
    id: number
  }
}

export default function UserDetailPage({params: {id}}: UserDetailsPageProps) {
  if (id > 10) notFound() // just an elaborate example
  return <div>UserDetailPage {id}</div>
}
```

If we do not have this file, it will just show the default not-found.tsx at the app root.

```tsx
//./app/users/[id]/not-found.tsx

export default function UserNotFound() {
  return <div>The user is not found.</div>
}
```

## Handling unexpected errors

