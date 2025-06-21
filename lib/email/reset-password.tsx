//-| file path: lib/email/reset-password.tsx
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

interface ResetPasswordEmailProps {
  username: string;
  resetLink: string;
}

export const reactResetPasswordEmail = ({
  username,
  resetLink,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head>
      <title>Reset your password</title>
    </Head>
    <Preview>Reset your password to regain access to your account</Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto py-8 px-4 max-w-md">
          <Section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <Heading className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Password Reset
            </Heading>

            <Text className="text-gray-700 mb-4 leading-relaxed">
              Hello {username},
            </Text>

            <Text className="text-gray-700 mb-6 leading-relaxed">
              We received a request to reset your password. If you made this
              request, click the button below to create a new password. If you
              didn&apos;t request this, you can safely ignore this email.
            </Text>

            <Section className="text-center mb-6">
              <Button
                href={resetLink}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium text-base hover:bg-red-700 transition-colors inline-block"
              >
                Reset Password
              </Button>
            </Section>

            <Text className="text-gray-600 text-sm mb-4 leading-relaxed">
              If the button above doesn&apos;t work, you can copy and paste this
              link into your browser:
            </Text>

            <Text className="text-blue-600 text-sm break-all mb-6">
              {resetLink}
            </Text>

            <Text className="text-gray-600 text-sm leading-relaxed">
              This password reset link will expire in 1 hour for security
              reasons. If you need to reset your password after this time,
              please request a new reset link.
            </Text>

            <Section className="mt-8 pt-6 border-t border-gray-200">
              <Text className="text-gray-500 text-xs text-center">
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

export default reactResetPasswordEmail;
