import { CreditDepletionNotificationData } from "@/app/(components)/CreditDepletionDialog.types";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface CreditDepletionEmailProps extends CreditDepletionNotificationData {}

export const CreditDepletionEmail = ({
  timestamp,
}: CreditDepletionEmailProps) => (
  <Html>
    <Head />
    <Preview>URGENT: OpenRouter Credits Depleted</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🚨 OpenRouter Credits Depleted</Heading>
        <Section style={section}>
          <Text style={label}>Timestamp</Text>
          <Text style={text}>{new Date(timestamp).toLocaleString()}</Text>
        </Section>
        <Section style={section}>
          <Text style={label}>Status</Text>
          <Text style={text}>
            An OpenRouter API request failed due to insufficient credits. Users
            are now seeing a notification dialog.
          </Text>
        </Section>
        <Section style={section}>
          <Text style={label}>Action Required</Text>
          <Text style={text}>
            Please refill your OpenRouter credits as soon as possible to
            restore service.
          </Text>
        </Section>
        <Section style={section}>
          <Link
            href="https://openrouter.ai/credits"
            style={link}
            target="_blank"
          >
            Go to OpenRouter Credits
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default CreditDepletionEmail;

const main = {
  backgroundColor: "#000000",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#111111",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #333333",
  borderRadius: "8px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0 20px 0",
  padding: "0 40px",
};

const section = {
  padding: "0 40px",
  marginBottom: "16px",
};

const label = {
  color: "#999999",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px 0",
};

const text = {
  color: "#ffffff",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0",
};

const link = {
  color: "#3b82f6",
  fontSize: "14px",
  textDecoration: "underline",
};
