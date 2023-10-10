import {UserSchema} from 'app/api/users/schema'
import {NextResponse, type NextRequest} from 'next/server'
import {prisma} from '@/prisma/client'
import type {User} from '@/app/api/users/schema'

type Props = {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, {params: {id}}: Props) {
  const user: User | null = await prisma.user.findUnique({
    where: {id: Number(id)},
  })

  if (!user) return NextResponse.json({error: 'User not found'})

  return NextResponse.json(user, {status: 200})
}

const userExists = (id: string) =>
  prisma.user.findUnique({where: {id: Number(id)}})

export async function PUT(request: NextRequest, {params: {id}}: Props) {
  const body: User = await request.json()
  const {name, email} = body

  // better validation with Zod
  const validation = UserSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {status: 400})
  }
  // used to be manual validation, like this
  // if (!body.name) {
  //   return NextResponse.json({error: 'Name is required'}, {status: 400})
  // }
  // if (!body.price) {
  //   return NextResponse.json({error: 'Price is required'}, {status: 400})
  // }

  if (!(await userExists(id)))
    return NextResponse.json({error: 'The user does not exist.'}, {status: 404})

  const updatedUser = await prisma.user.update({
    where: {id: Number(id)},
    data: {name, email},
  })

  return NextResponse.json(updatedUser, {status: 200})
}

export async function DELETE(request: NextRequest, {params: {id}}: Props) {
  if (!(await userExists(id)))
    return NextResponse.json({error: 'The user does not exist.'}, {status: 404})

  const deletedUser = await prisma.user.delete({where: {id: Number(id)}})

  return NextResponse.json(deletedUser)
}
