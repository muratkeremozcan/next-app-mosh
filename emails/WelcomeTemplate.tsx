import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
} from '@react-email/components'

export default function WelcomeTemplate({name}: {name: string}) {
  return (
    <Html>
      <Preview>Welcome aboard!</Preview>
      <Body>
        <Container>
          <Text>Hello {name}</Text>
          <Link href="https://react-email.js.org">React Email</Link>
        </Container>
      </Body>
    </Html>
  )
}
