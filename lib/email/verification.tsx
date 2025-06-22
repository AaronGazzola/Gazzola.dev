//-| File path: lib/email/verification.tsx
//-| file path: lib/email/verification.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verificationLink: string;
}

export const reactVerificationEmail = ({
  username,
  verificationLink,
}: VerificationEmailProps) => (
  <Html>
    <Head>
      <title>Verify your email address</title>
    </Head>
    <Preview>
      Please verify your email address to complete your registration
    </Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto max-w-md px-4 py-8">
          <Section className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <Heading className="mb-6 text-center text-2xl font-bold text-gray-900">
              Verify Your Email
            </Heading>

            <Text className="mb-4 leading-relaxed text-gray-700">
              Hello {username},
            </Text>

            <Text className="mb-6 leading-relaxed text-gray-700">
              Thank you for signing up! To complete your registration and secure
              your account, please verify your email address by clicking the
              button below.
            </Text>

            <Section className="mb-6 text-center">
              <Button
                href={verificationLink}
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
              >
                Verify Email Address
              </Button>
            </Section>

            <Text className="mb-4 text-sm leading-relaxed text-gray-600">
              If the button above doesn&apos;t work, you can copy and paste this
              link into your browser:
            </Text>

            <Text className="mb-6 text-sm break-all text-blue-600">
              {verificationLink}
            </Text>

            <Text className="text-sm leading-relaxed text-gray-600">
              This verification link will expire in 24 hours for security
              reasons. If you didn&apos;t create an account, you can safely
              ignore this email.
            </Text>

            <Section className="mt-8 border-t border-gray-200 pt-6">
              <Text className="text-center text-xs text-gray-500">
                This email was sent from an automated system. Please do not
                reply to this email.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default reactVerificationEmail;
