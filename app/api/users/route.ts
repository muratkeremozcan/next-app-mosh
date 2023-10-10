import {NextResponse, type NextRequest} from 'next/server'
import {UserSchema} from 'app/api/users/schema'
import {prisma} from '@/prisma/client'
import type {User} from '@/app/api/users/schema'

// need to have an argument (although not used) to prevent NextJs caching the result
export async function GET(request: NextRequest) {
  const users: User[] = await prisma.user.findMany()

  return NextResponse.json(users, {status: 200})
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {name, email}: User = body

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

  // what do we do if the user already exists?
  const userExists = await prisma.user.findUnique({where: {email}})
  if (userExists)
    return NextResponse.json({error: 'User already exists.'}, {status: 400})

  const user = await prisma.user.create({data: {name, email}})

  return NextResponse.json(user, {status: 201})
}
