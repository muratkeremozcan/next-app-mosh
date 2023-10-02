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
