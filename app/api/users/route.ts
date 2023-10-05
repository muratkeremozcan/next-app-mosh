import {NextResponse, type NextRequest} from 'next/server'

// need to have an argument (although not used) to prevent NextJs caching the result
// which would be fine, really, because the result is always the same...
export function GET(request: NextRequest) {
  return NextResponse.json([
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Doe'},
  ])
}
