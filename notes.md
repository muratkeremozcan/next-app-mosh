## NextJS fundamentals

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
// ./app/users/page.tsx

export default async function UsersPage() {
...

  <>
    <h1>Users</h1>
    <p>{new Date().toLocaleTimeString()}</p>
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  </>
}
```

`npm run build && npm start` for production mode. After build, it will show us
that the sites are static, they will never update for users.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vcps2uiq7202jb8xg42w.png)

If we specify no cache, then it would not be a static page, but instead be
server side rendered (SSR).

```tsx
// ./app/users/page.tsx
export default async function UsersPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    cache: 'no-store',
  })
  ...
}
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1gq0ghejoy3toqp73cjk.png)

## Styles

In Next.js projects, we define global styles in `/app/global.css`. Reserve this file for global styles that need to be applied across multiple pages and components. Avoid adding excessive styles to this file, as it can quickly grow out of hand and become difficult to maintain

### CSS modules

In traditional CSS, if we define the same class in two different files, one will overwrite the other depending on the order in which these files are imported. CSS modules help us prevent this problem. A CSS module is a CSS file that is scoped to a page or component.

During the build process, Next.js uses a tool called PostCSS to transform our CSS class names and generate unique class names. This prevents clashes between different CSS classes across the application.

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

Ta i l w i n d is a widely-used CSS framework for styling application. It offers a comprehensive set of small, reusable utility classes. We can combine these classes to create beautiful user interfaces

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

### How do we deal with duplicated styles?

If you have multiple components sharing the same styles in Tailwind CSS, there are several strategies you can employ to avoid duplicating the styles:

1. **CSS Component Classes with `@apply`**:
    You can create custom component classes in your CSS using the `@apply` directive. 

    ```css
    /* styles.css or tailwind.css */
    .product-card {
        @apply p-5 m-5 bg-sky-400 text-white text-xl;
    }
    
    .product-card:hover {
        @apply bg-sky-500;
    }
    ```

    Now, you can use this class in your JSX:

    ```jsx
    export default function ProductCard() {
      return (
        <div className="product-card">
          <AddToCart />
        </div>
      )
    }
    ```

2. **JS/JSX Utility Functions**:
   You can create a utility function that returns a string of the common class names.

    ```jsx
    function productCardStyles() {
      return "p-5 m-5 bg-sky-400 text-white text-xl hover:bg-sky-500";
    }
   
    export default function ProductCard() {
      return (
        <div className={productCardStyles()}>
          <AddToCart />
        </div>
      )
    }
    ```

3. **Wrap with a Shared Component**:
   You can create a shared component that wraps the content with the shared styles.

    ```jsx
    function StyledDiv({ children }) {
      return (
        <div className="p-5 m-5 bg-sky-400 text-white text-xl hover:bg-sky-500">
          {children}
        </div>
      );
    }
   
    export default function ProductCard() {
      return (
        <StyledDiv>
          <AddToCart />
        </StyledDiv>
      )
    }
    ```

4. **Context or Theming**:
   If you want more dynamic styles or you're looking to theme your components, consider using a context or some kind of theming approach. This is more involved but allows for greater flexibility. (daisyUI)

5. **Extracting Plugins in Tailwind**:
    If you find that you are creating a lot of custom component styles, you might also consider creating plugins to extract these patterns for easier reuse. This is a more advanced use-case and requires more configuration.(daisyUI)

Whatever method you choose, the aim is to keep your codebase DRY (Don't Repeat Yourself), maintainable, and easy to understand. Choose the method that feels the most natural to your project's scale and the team's preferences.

### daisyUI (bootstrap for Tailwind)

DaisyUI is a component library built on top of Tailwind. It provides a collection of pre-designed and reusable components such as accordion, badge, card, etc.

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

## Routing

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vsp5ck6kezxohcfdgdut.png)
