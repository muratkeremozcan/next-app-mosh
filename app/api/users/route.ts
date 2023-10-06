import {NextResponse, type NextRequest} from 'next/server'

// need to have an argument (although not used) to prevent NextJs caching the result
// which would be fine, really, because the result is always the same...
export function GET(request: NextRequest) {
  return NextResponse.json([
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Doe'},
  ])
}

const getRandomId = (min = 1, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.name) {
    return NextResponse.json({error: 'Name is required'}, {status: 400})
  }

  return NextResponse.json({id: getRandomId(), name: body.name}, {status: 201})
}
