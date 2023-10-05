import {NextResponse, type NextRequest} from 'next/server'

type Props = {
  params: {
    id: number
  }
}

export function GET(request: NextRequest, {params: {id}}: Props) {
  if (id > 10) return NextResponse.json({error: 'User not found'})

  return NextResponse.json({id: 1, name: 'Murat'})
}
