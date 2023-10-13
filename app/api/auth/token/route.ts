import {getToken} from 'next-auth/jwt'
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

// for experimentation
// visit the route and we will get the token.

export async function GET(request: NextRequest) {
  const token = await getToken({req: request})
  return NextResponse.json(token)
}
