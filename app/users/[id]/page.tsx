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
