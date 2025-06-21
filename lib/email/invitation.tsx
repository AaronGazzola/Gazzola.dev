//-| file path: lib/email/invitation.tsx
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

interface InvitationEmailProps {
  username: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}

export const reactInvitationEmail = ({
  username,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: InvitationEmailProps) => (
  <Html>
    <Head>
      <title>You&apos;ve been invited to join an organization</title>
    </Head>
    <Preview>
      You&apos;ve been invited to join {teamName} - Accept your invitation
    </Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto max-w-md px-4 py-8">
          <Section className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <Heading className="mb-6 text-center text-2xl font-bold text-gray-900">
              Team Invitation
            </Heading>

            <Text className="mb-4 leading-relaxed text-gray-700">
              Hello {username},
            </Text>

            <Text className="mb-4 leading-relaxed text-gray-700">
              <strong>{invitedByUsername}</strong> ({invitedByEmail}) has
              invited you to join the <strong>{teamName}</strong> organization.
            </Text>

            <Text className="mb-6 leading-relaxed text-gray-700">
              Accept this invitation to collaborate with your team members and
              access shared resources and projects.
            </Text>

            <Section className="mb-6 text-center">
              <Button
                href={inviteLink}
                className="inline-block rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700"
              >
                Accept Invitation
              </Button>
            </Section>

            <Text className="mb-4 text-sm leading-relaxed text-gray-600">
              If the button above doesn&apos;t work, you can copy and paste this
              link into your browser:
            </Text>

            <Text className="mb-6 text-sm break-all text-blue-600">
              {inviteLink}
            </Text>

            <Text className="text-sm leading-relaxed text-gray-600">
              This invitation will remain valid until you accept it or it&apos;s
              revoked by an administrator. If you weren&apos;t expecting this
              invitation or don&apos;t want to join this organization, you can
              safely ignore this email.
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

export default reactInvitationEmail;
