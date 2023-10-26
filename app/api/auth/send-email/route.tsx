import WelcomeTemplate from '@/emails/WelcomeTemplate'
import {NextResponse} from 'next/server'
import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  await resend.emails.send({
    from: 'update2.example.com',
    to: 'muratkerem@gmail.com',
    subject: 'any subject',
    react: <WelcomeTemplate name="Murat Ozcan" />,
  })
  console.log('worked')

  return NextResponse.json({})
}
