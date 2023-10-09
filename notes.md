## Basics

New stuff in Next:

1. **Static Site Generation (SSG):** This allows for a blazing fast performance since pages are generated at build time and served as static files. It can be especially useful for content-driven sites where the data doesn't change frequently.

2. **Server-side Rendering (SSR):** Perfect for pages where content changes often or is based on user data. It allows content to be generated on the server at runtime for each request.

3. **API Routes:** With `api/` routes, you can easily build your API endpoints within the Next.js app, making it a seamless integration between your frontend and backend.

4. **File System-Based Routing:** No need for complicated routing setups. Your file and folder structure directly translate to your app's routes.

5. **Built-in CSS and Sass Support:** With Next.js, you can import CSS directly into your components without additional configurations.

6. **Image Optimization:** The `next/image` component allows for automatic optimization of images for faster load times and better performance.

7. **Fast Refresh:** Experience near-instant feedback during development. Any changes in your React components reflect instantly without losing component state.

8. **TypeScript Support:** If you prefer TypeScript, Next.js provides an out-of-the-box setup to support it.

App routing is setup under `./app`

By default all components in the `./app` folder are server components. If we
want to make them client components, we insert `'use client'` at the top of the file.

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

- Listen to browser events, or access browser APIs
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
// ./tailwind.config.ts

import type {Config} from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['winter'],
  },
}
export default config

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

App router looks for special files such to define the routes:

* `page.tsx`

* `layout.tsx`

* `loading.tsx`

* `not-found.tsx`

* `error.tsx`

  

### Dynamic route (`params`)

A dynamic route is one that takes one or more parameters. To add parameters to our routes, we wrap directory names with square brackets (eg [id])

A route with a parameter. The syntax is like so:

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

### Catch-all segments (varying number of parameters in a route) `[][...slug]]`

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

### Accessing query string parameters `searchParams`

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

In standard React applications, we use the state hook for managing component state. In server-rendered applications, however, we use query string parameters to keep state. This also allows us to bookmark our pages in specific state. For example, we can bookmark a filtered and sorted list of products

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

We can create additional layouts for specific areas of our application (eg /app/admin/layout.tsx).

Suppose we want a different layout for admin users with a sidebar:

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

For further styling at each component, at global styles, we can override the 3 directives on top with `@layer` and
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

  `rsc` indicates that it is a react server component.

  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/buic7c7jt50me87i906c.png)

- Prefetches the links that are in the viewport, to provide smooth navigation between pages,
  
  We need to run the app in production mode to see this:
  
  `npm run build && npm start` The sort-by links (name and email) are
  pre-fetched to improve performance.
  
  ![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/amju4hvrapm569tqd1e9.png)
  
- Caching; as the user moves around our application, Next.js stores the page content in a cache on the client. So, if they revisit a page that already exists in the cache, Next.js simply grabs it from the cache instead of making a new request to the server. The client cache exists in the browser’s memory and lasts for an entire session. It gets reset when we do a full refresh. 

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

### Showing Loading UIs 

#### React Suspense

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

#### Using the `loading.tsx` file

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

### Handling Errors

#### Not Found errors (not-found.tsx file)

Similar to the `loading.tsx` file, NextJs has a `not-found.tsx` file we can use. The component gets rendered on a page that doesn't exist.

```tsx
// ./app/not-found.tsx

export default function NotFound() {
  return <div>The requested page does not exist</div>
}
```

If we want not found pages specific to the routes, we use the built-in notFound() function. This redirects us to the NotFound page above.

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

If we want to further customize the not found page on the sub routes, we create `not-found.tsx` files in that route.

If we do not have this file, it will just show the default not-found.tsx at the app root.

```tsx
//./app/users/[id]/not-found.tsx

export default function UserNotFound() {
  return <div>The user is not found.</div>
}
```

#### Unexpected errors (error.tsx file)

Similar to `loading.tsx` we can have an `error.tsx` file at different folder/route levels.

We use the props `error` and `reset` (NexJS knows about these).

```tsx
// app/error.tsx

'use client'

type ErrorComponentProps = {
  error: Error
  reset: () => void
}

export default function ErrorComponent({error, reset}: ErrorComponentProps) {
  console.error({error})
  return (
    <>
      <div>An unexpected error has occurred:</div>
      <button className="btn" onClick={() => reset()}>
        Retry
      </button>
    </>
  )
}

```

But, we cannot capture errors that happen in the `RootLayout` file with `error-tax`. For that we create the file called `global-error.tsx`.

## Building APIs

The convention is to use a folder named `api` for backend. You cannot have `page.tsx` and `route.ts` in the same folder. `route.ts` files are where we handle requests.

The main idea here is that routes like PUT, DELETE, and sometimes GET need an id, and go to a certain route. Routes like POST, and sometimes GET, hit a generic route. Based on that wide-spread fact, Next.js houses the routes in certain route folders.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0kpoovv16zw7p79jik21.png)

```tsx
// ./app/api/users/route.ts

import {NextResponse, type NextRequest} from 'next/server'

// need to have an argument (although not used) to prevent NextJs caching the result
// which would be fine, really, because the result is always the same...
export function GET(request: NextRequest) {
  return NextResponse.json([
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Doe'},
  ])
}
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x16hkm4629lywdok2i09.png)

### Getting a single object

Similar parameter convention to dynamic routes for pages, here we are also using the params object as a prop.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/scqcz76uwxb7b63ew050.png)

The only difference is that the object is the second argument.

```ts
// ./app/api/users/[id]/route.ts

import {NextResponse, type NextRequest} from 'next/server'

type Props = {
  params: {
    id: number
  }
}

export function GET(request: NextRequest, {params: {id}}: Props) {
  if (id > 10) return NextResponse.json({error: 'User not found'})

  return NextResponse.json({id: 1, name: 'Murat'})
}
```

Compare to dynamic route for a page.

```tsx
// ./app/users/[id]/page.tsx

// using the built-in notFound component
import {notFound} from 'next/navigation'

// single param case for dynamic route;
// use the `params` object (as a prop) in the component to utilize it.
type UserDetailsPageProps = {
  params: {
    id: number
  }
}

export default function UserDetailPage({params: {id}}: UserDetailsPageProps) {
  if (id > 10) notFound()
  return <div>UserDetailPage {id}</div>
}
```

### Updating and Deleting a single object

Similar to Get, Update are Delete are at `api/users/[id]/route.ts`, because they interact with an entity that has an id.

```ts
// ./app/api/users/[id]/route.ts

import {NextResponse, type NextRequest} from 'next/server'

type Props = {
  params: {
    id: number
  }
}

export function GET(request: NextRequest, {params: {id}}: Props) {
  if (id > 10) return NextResponse.json({error: 'User not found'})

  return NextResponse.json({id: 1, name: 'Murat'})
}

export async function PUT(request: NextRequest, {params: {id}}: Props) {
  const body = await request.json()
  if (!body.name) {
    return NextResponse.json({error: 'Name is required'}, {status: 400})
  }

  if (id > 10)
    return NextResponse.json({error: 'User not found'}, {status: 404})

  return NextResponse.json({id: Number(id), name: body.name})
}

export async function DELETE(request: NextRequest, {params: {id}}: Props) {
  if (id > 10)
    return NextResponse.json({error: 'User not found'}, {status: 404})

  return NextResponse.json({})
}
```



### Getting objects, Posting an object

These all go to the `api/users/route.ts` since they do not take an id.

```tsx
// ./app/api/users/route.ts

import {NextResponse, type NextRequest} from 'next/server'

// need to have an argument (although not used) 
// to prevent NextJs caching the result
// which would be fine, really, because the result is always the same...
export function GET(request: NextRequest) {
  return NextResponse.json([
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Doe'},
  ])
}

const getRandomId = (min = 1, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.name) {
    return NextResponse.json(
      {error: 'Name is required'}, 
      {status: 400}
    )
  }

  return NextResponse.json(
    {id: getRandomId(), name: body.name},
    {status: 201}
  )
}
```

### Zod

In the above for object crud, we have too many if statements for handling the shape of objects, which is called manual schema validation. Instead we can use a validation library such as Zod.

Previously we had our User type:

```ts
// ./app/users/types.ts
export type User = {
  id: number
  name: string
  email: string
}
```

We can use the same type, but this time with schema validation of Zod. Think of schema like a more detailed specification of the type definition.

```ts
// ./app/users/schema.ts

import {z} from 'zod'

export const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  id: z.number().optional(),
})

export type User = z.infer<typeof UserSchema>
```

After that, in our functions, we can do better validation with `schema.safeParse(...)` and `.success`.

```ts
// ./app/api/users/[id]/route.tsx

import {UserSchema} from 'app/users/schema'
import {NextResponse, type NextRequest} from 'next/server'

type Props = {
  params: {
    id: number
  }
}

export function GET(request: NextRequest, {params: {id}}: Props) {
  if (id > 10) return NextResponse.json({error: 'User not found'})

  return NextResponse.json({id: 1, name: 'Murat'})
}

export async function PUT(request: NextRequest, {params: {id}}: Props) {
  const body = await request.json()

  // better validation with Zod
  const validation = UserSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {status: 400})
  }
  // used to be manual validation, like this
  // if (!body.name) {
  //   return NextResponse.json({error: 'Name is required'}, {status: 400})
  // }

  if (id > 10)
    return NextResponse.json({error: 'User not found'}, {status: 404})

  return NextResponse.json({id: Number(id), name: body.name})
}

export async function DELETE(request: NextRequest, {params: {id}}: Props) {
  if (id > 10)
    return NextResponse.json({error: 'User not found'}, {status: 404})

  return NextResponse.json({})
}

```

## DB integration with Prisma

### What is Prisma for?

Prisma is an open-source database toolkit that includes:

1. **Prisma Client**: An auto-generated query builder used to access databases in a type-safe manner.
2. **Prisma Migrate**: A declarative data modeling and migration system.
3. **Prisma Studio**: A modern GUI to view and edit your database records.
4. **Prisma Schema**: A central source of truth for your database schema, from which the Prisma Client API and database migrations are derived.

Prisma offers the following benefits:

- **Type Safety**: Prisma Client integrates with TypeScript and Flow, providing a level of type safety when querying the database.
  
- **Auto-Generated Client**: Instead of writing raw SQL or using an ORM's custom query language, developers can use the auto-generated Prisma Client to compose queries.
  
- **Declarative Migrations**: Prisma Migrate allows developers to define their database schema in the Prisma schema language, and migrations are generated from changes to this schema, making it easier to evolve the database over time.
  
- **Modern Tooling**: With tools like Prisma Studio, developers get a powerful database GUI right out of the box.

### What did people do before Prisma?

Before Prisma and similar tools, developers relied on various strategies and tools to interact with databases:

1. **Raw SQL Queries**: Developers often wrote plain SQL queries to interact with the database, which can be error-prone without careful management and can lack type safety in application code.

2. **ORMs (Object-Relational Mappings)**: ORMs like Sequelize (Node.js), Hibernate (Java), and ActiveRecord (Ruby on Rails) allowed developers to interact with their databases using objects in their respective programming languages. These ORMs can abstract away some of the database complexities but can also come with their own set of challenges, such as performance issues, a steep learning curve, or inflexibility with complex queries.

3. **Database GUI Tools**: Before Prisma Studio, developers used standalone tools like MySQL Workbench, pgAdmin, or DBeaver to visually inspect and manage their databases.

4. **Migration Tools**: Tools like Flyway, Liquibase, and the migration systems integrated into ORMs were used to manage changes to the database schema over time.

5. **Database Drivers**: Most programming languages had libraries or drivers that facilitated direct connections to databases (e.g., `pg` for PostgreSQL in Node.js).

6. **Custom Abstractions**: Some teams or projects built custom abstractions or layers on top of SQL or their database drivers to make database interactions more consistent or developer-friendly.

In summary, before tools like Prisma, developers relied on a mix of ORMs, raw SQL, custom abstractions, and standalone database tools to interact with their databases. Prisma aims to provide a unified, type-safe, and developer-friendly toolkit that encompasses many of these functionalities.

### Prerequisites & setup

> Prerequisite: Install [MySQL community version](https://dev.mysql.com/downloads/mysql/) and DB viewer ([JetBrains DataGrip 30 day trial](https://www.jetbrains.com/datagrip/)) 

ORM: Object Relational Mapper; a tool that sits between our app and a DB, to CRUD data. We are going to use Prisma as an ORM. `npm i prisma` .

Initialize Prisma. It creates `./prisma/schema.prisma` and adds a `DATABASE_URL` var to a `.env` file.

```bash
npx prisma init
```

Check the reference for [Prisma Connectors  > MySQL]((https://www.prisma.io/docs/concepts/database-connectors/mysql)); we need to update the `DATABASE_URL` var accordingly.

`DATABASE_URL="mysql://root:<yourPW>@localhost:3306/nextapp"`

Change the provider to `mysql` at `./prisma/schema.prisma`

```ts
// ./prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Defining Models

We need to define the models for our entities (User & Product) at `schema.prisma` file.

```ts
// ./prisma/schema.prisma

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  followers Int      @default(0)
  isActive  Boolean  @default(true)
}

model Product {
  id        Int      @id @default(autoincrement())
  name      String
  price     Int
}
```

>  We can format the file with `npx prisma format`.
>
> More examples at https://www.prisma.io/docs/concepts/components/prisma-schema/data-model.

### Creating migrations

As you design or modify your application's models within the Prisma schema, you'll need to create migrations to reflect these changes in the actual database. 

Migrations are sets of instructions that tell the database how to transform its schema from one state to another, ensuring your database schema remains in sync with your Prisma schema.

Here's a more detailed breakdown of the migration process with Prisma:

1. **Define or Modify Models**: Start by designing or changing your models within the Prisma schema (`schema.prisma`).
2. **Generate a New Migration**: Using the Prisma CLI with the `prisma migrate dev` command, Prisma will compare the current state of the database with your newly defined or modified models. It then generates a new migration, which is essentially a SQL script that captures the necessary changes to transition the database schema to match the Prisma schema.
3. **Migration Files**: This generated SQL script is saved in a `migration.sql` file within a timestamped folder under the `prisma/migrations` directory. Each migration has its own folder, allowing you to keep a historical record of all changes made to the database over time.
4. **Apply Migrations**: When you're ready, you can apply these migrations to the actual database, either during development with `prisma migrate dev` or in production with `prisma migrate deploy`. This will execute the SQL statements in the migration files, updating the database schema to match the Prisma schema.

In essence, migrations serve as a bridge, ensuring that changes made in your Prisma schema are accurately and safely reflected in your database. This ensures consistency between your application's data model and the underlying database structure.

```bash
# start sql server
sudo /usr/local/mysql/bin/mysqld_safe

# on another tab
npx prisma migrate dev

# enter a name for the migration
initial
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f3h621u313ni5fahdmrp.png)

That gets a sql file created, which has instructions for creating a db table.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c8kbdk9nzk8rj2wrilj1.png)

```sql
-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `followers` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```



If we browse our database, we will see a table called user

At DataGrip (or any other DB browser):

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p77jb4o8l9iuksxdiiez.png)

We used `next app` as the db name in the .`env` file, we also set the user and password there, so replicate those values here:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iz9axfljpc3rx62upfqp.png)

Initially you need to download the missing drivers, so hit that button and Test the connection. It should just connect.

Create an item in the database for User and submit it

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5fnmacorllzpxvmlvwe1.png)

Now, let's modify our Prisma schema with createdAt field.

```ts
// ./prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  followers Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

model Product {
  id        Int      @id @default(autoincrement()) 
  name      String
  price     Int
  createdAt DateTime @default(now())
}
```

After that change, migrate the database one more time with `npx prisma migrate dev` and give the migration a name like `add registered-at.

A new folder and file gets created for the migration

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x4wg5dsatpkriimjs5gl.png)

Once we refresh the DB browser, we will see the field `createdAt` get added for the entity, even to the items already existing in the DB.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uzq7sp2n2lo9by3facax.png)

### Creating a Prisma client

To work with our db, we need to create a prisma client. 

**Prisma Client**: An auto-generated query builder used to access databases in a type-safe manner.

> Prisma client is always in sync with our db models.
>
> We can create the Prisma client anywhere in our app, but we want to make sure there is always at most 1 instance of it running; a singleton.

```ts
// ./prisma/client.ts

import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export default prisma

```

In Next.js, development mode, any time we change our source code, our modules get refreshed (hot module reloading), this end up in too many Prisma clients. We need to use the workaround for Next.js from their docs https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices.

```ts
// ./prisma/client.ts

import {PrismaClient} from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

