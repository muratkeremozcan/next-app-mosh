'use client'
import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from './components/ProductCard'
import type {User} from './api/users/schema'
import clouds from '@/public/images/clouds.png'
import dynamic from 'next/dynamic'
// we also have an optional argument to show something during load
const HeavyComponent = dynamic(() => import('./components/HeavyComponent'), {
  loading: () => <div>Heavy component loading...</div>,
  // ssr: false // option to disable server side rendering (in case we are accessing browser apis)
})

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
  const [isVisible, setIsVisible] = useState(false)

  return (
    <main className="relative h-screen">
      <h1>Hello {session && <span>{session.user.name} </span>}</h1>
      <Link data-cy="home-page-users-link" href="/users">
        Users
      </Link>
      <ProductCard />
      <button onClick={() => setIsVisible(true)}>Show heavy component </button>
      {isVisible && <HeavyComponent />}

      <Image src={clouds} alt="local image"></Image>
      {/* <Image
        src="https://bit.ly/react-cover"
        alt="remote image"
        width={300}
        height={170}
        // fill
        // className="object-cover"
        // sizes="(max-width= 480px) 100vw, (max-width= 768px) 50vw, 33vw"
      ></Image> */}

      {/* we can lazy load libraries */}
      <button
        onClick={async () => {
          const _ = (await import('lodash')).default

          const users = [{name: 'c'}, {name: 'b'}, {name: 'a'}]

          const sorted = _.orderBy(users, ['name'])
          console.log(sorted)
        }}
      >
        do lodash things
      </button>
    </main>
  )
}
