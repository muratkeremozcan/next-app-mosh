import {ProductSchema} from 'app/api/products/schema'
import {NextResponse, type NextRequest} from 'next/server'
import {prisma} from '@/prisma/client'
import type {Product} from '@/app/api/products/schema'

type Props = {
  params: {
    id: string
  }
}

const productExists = (id: string) =>
  prisma.product.findUnique({
    where: {id: Number(id)},
  })
export async function GET(request: NextRequest, {params: {id}}: Props) {
  const product: Product | null = await prisma.product.findUnique({
    where: {id: Number(id)},
  })

  if (!product) return NextResponse.json({error: 'Product not found'})

  return NextResponse.json(product, {status: 200})
}

export async function PUT(request: NextRequest, {params: {id}}: Props) {
  const body: Product = await request.json()
  const {name, price} = body

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

  if (!(await productExists(id)))
    return NextResponse.json(
      {error: 'The product does not exist.'},
      {status: 404},
    )

  const updatedProduct = await prisma.product.update({
    where: {id: Number(id)},
    data: {name, price},
  })

  return NextResponse.json(updatedProduct, {status: 200})
}

export async function DELETE(request: NextRequest, {params: {id}}: Props) {
  if (!(await productExists(id)))
    return NextResponse.json(
      {error: 'The product does not exist.'},
      {status: 404},
    )

  const deletedProduct = await prisma.product.delete({
    where: {id: Number(id)},
  })

  return NextResponse.json(deletedProduct)
}
