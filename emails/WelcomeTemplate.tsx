import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Tailwind,
} from '@react-email/components'

export default function WelcomeTemplate({name}: {name: string}) {
  return (
    <Html>
      <Preview>Welcome aboard!</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container>
            <Text className="font-bold text-3xl">Hello {name}</Text>
            <Link href="https://react-email.js.org">React Email</Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
