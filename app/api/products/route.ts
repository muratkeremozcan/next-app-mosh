import {NextResponse, type NextRequest} from 'next/server'
import {ProductSchema} from 'app/api/products/schema'
import {prisma} from '@/prisma/client'
import type {Product} from '@/app/api/products/schema'

// need to have an argument (although not used) to prevent NextJs caching the result
export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany()

  return NextResponse.json(products, {status: 200})
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {name, price}: Product = body

  const validation = ProductSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {status: 400})
  }

  const productExists = await prisma.product.findUnique({where: {name}})
  if (productExists)
    return NextResponse.json({error: 'Product already exists.'}, {status: 400})

  const product = await prisma.product.create({data: {name, price}})

  return NextResponse.json(product, {status: 201})
}
