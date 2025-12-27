import { FeedbackFormData } from "@/app/(components)/Sidebar.types";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface FeedbackEmailProps extends FeedbackFormData {}

export const FeedbackEmail = ({ message }: FeedbackEmailProps) => (
  <Html>
    <Head />
    <Preview>New feedback / bug report</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Feedback / Bug Report</Heading>
        <Section style={section}>
          <Text style={text}>{message}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default FeedbackEmail;

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
