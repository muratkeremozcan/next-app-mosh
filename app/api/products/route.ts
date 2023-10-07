import {NextResponse, type NextRequest} from 'next/server'
import {ProductSchema} from 'app/api/products/schema'
import {getRandomId} from '../util'

// need to have an argument (although not used) to prevent NextJs caching the result
// which would be fine, really, because the result is always the same...
export function GET(request: NextRequest) {
  return NextResponse.json([
    {id: 1, name: 'Milk', price: 2.5},
    {id: 2, name: 'Bread', price: 3.5},
  ])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {name, price} = body

  const validation = ProductSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {status: 400})
  }

  return NextResponse.json({id: getRandomId(), name, price}, {status: 201})
}
