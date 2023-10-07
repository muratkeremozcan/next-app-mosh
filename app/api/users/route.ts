import {NextResponse, type NextRequest} from 'next/server'
import {UserSchema} from 'app/api/users/schema'
import {getRandomId} from '../util'

// need to have an argument (although not used) to prevent NextJs caching the result
// which would be fine, really, because the result is always the same...
export function GET(request: NextRequest) {
  return NextResponse.json([
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Doe'},
  ])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {name, email} = body

  const validation = UserSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {status: 400})
  }
  // used to be manual validation, like this
  // if (!body.name) {
  //   return NextResponse.json({error: 'Name is required'}, {status: 400})
  // }
  // if (!body.email) {
  //   return NextResponse.json({error: 'Email is required'}, {status: 400})
  // }

  return NextResponse.json({id: getRandomId(), name, email}, {status: 201})
}
