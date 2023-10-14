import Link from 'next/link'
import ProductCard from './components/ProductCard'
import type {User} from './api/users/schema'

export type Session = {
  user: User & {
    image: string | null
  }
  expires: string
}

type HomePageCoreProps = {
  session: Session | null
}

export default function HomePageCore({session}: HomePageCoreProps) {
  return (
    <main>
      <h1>Hello {session && <span>{session.user.name} </span>}</h1>
      <Link data-cy="home-page-users-link" href="/users">
        Users
      </Link>
      <ProductCard />
    </main>
  )
}
