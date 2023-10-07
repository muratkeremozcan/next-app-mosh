import {ProductSchema} from 'app/api/products/schema'
import {NextResponse, type NextRequest} from 'next/server'

type Props = {
  params: {
    id: number
  }
}

export function GET(request: NextRequest, {params: {id}}: Props) {
  if (id > 10) return NextResponse.json({error: 'Product not found'})

  return NextResponse.json({id: 1, name: 'Milk'})
}

export async function PUT(request: NextRequest, {params: {id}}: Props) {
  const body = await request.json()

  // better validation with Zod
  const validation = ProductSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {status: 400})
  }
  // used to be manual validation, like this
  // if (!body.name) {
  //   return NextResponse.json({error: 'Name is required'}, {status: 400})
  // }
  // used to be manual validation, like this
  // if (!body.price) {
  //   return NextResponse.json({error: 'Price is required'}, {status: 400})
  // }

  if (id > 10)
    return NextResponse.json({error: 'Product not found'}, {status: 404})

  return NextResponse.json({id: Number(id), name: body.name})
}

export async function DELETE(request: NextRequest, {params: {id}}: Props) {
  if (id > 10)
    return NextResponse.json({error: 'Product not found'}, {status: 404})

  return NextResponse.json({})
}
