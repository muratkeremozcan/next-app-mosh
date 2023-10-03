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
