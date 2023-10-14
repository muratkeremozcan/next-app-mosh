import {getServerSession} from 'next-auth'
import {authOptions} from './api/auth/[...nextauth]/route'
import type {Session} from './pageCore'
import HomeCoreComponent from './pageCore'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return <HomeCoreComponent session={session as Session | null} />
}
