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
import * as React from "react";
import { CodeReviewFormData } from "@/app/(editor)/Footer.types";

interface CodeReviewRequestEmailProps extends CodeReviewFormData {}

export const CodeReviewRequestEmail = ({
  name,
  email,
  message,
}: CodeReviewRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>New inquiry from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Quality Assurance Inquiry</Heading>
        <Section style={introSection}>
          <Text style={introText}>
            Hi, I'm Aaron (34M; BSc. Hons.), I specialize in Quality Assurance
            for web apps generated with Lovable. I provide in-depth analysis,
            refactoring, and automated testing for every aspect of your web
            app. My 5 years of experience in full-stack design and development
            provide me with critical insight and comprehensive knowledge of
            every aspect of your project. You will receive in-depth progress
            reports and test results at each stage of development - lifting the
            veil on the inner workings of your creation.
          </Text>
        </Section>
        <Section style={section}>
          <Text style={label}>Name:</Text>
          <Text style={text}>{name}</Text>
        </Section>
        <Section style={section}>
          <Text style={label}>Email:</Text>
          <Text style={text}>{email}</Text>
        </Section>
        <Section style={section}>
          <Text style={label}>Message:</Text>
          <Text style={text}>{message}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default CodeReviewRequestEmail;

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

const introSection = {
  padding: "0 40px",
  marginBottom: "32px",
  backgroundColor: "#1a1a1a",
  borderLeft: "3px solid #4B73FF",
  paddingLeft: "37px",
};

const introText = {
  color: "#cccccc",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
  fontStyle: "italic",
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
