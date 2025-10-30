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
import * as React from "react";
import { NDAFormData } from "@/app/(editor)/Footer.types";

interface CodeReviewRequestEmailProps {
  githubUrl: string;
  message: string;
  userEmail: string;
  isPrivate: boolean;
  ndaRequested?: boolean;
  ndaDetails?: NDAFormData;
}

export const CodeReviewRequestEmail = ({
  githubUrl,
  message,
  userEmail,
  isPrivate,
  ndaRequested,
  ndaDetails,
}: CodeReviewRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>New Code Review Request from {userEmail}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Code Review Request</Heading>
        <Section style={section}>
          <Text style={label}>Repository URL:</Text>
          <Link href={githubUrl} style={link}>
            {githubUrl}
          </Link>
        </Section>
        <Section style={section}>
          <Text style={label}>User Email:</Text>
          <Text style={text}>{userEmail}</Text>
        </Section>
        <Section style={section}>
          <Text style={label}>Repository Type:</Text>
          <Text style={text}>{isPrivate ? "Private" : "Public"}</Text>
        </Section>
        {ndaRequested && (
          <>
            <Section style={section}>
              <Text style={label}>NDA Requested:</Text>
              <Text style={text}>Yes</Text>
            </Section>
            {ndaDetails && (
              <>
                <Section style={section}>
                  <Text style={label}>Legal Entity Name:</Text>
                  <Text style={text}>{ndaDetails.legalEntityName}</Text>
                </Section>
                <Section style={section}>
                  <Text style={label}>Jurisdiction:</Text>
                  <Text style={text}>{ndaDetails.jurisdiction}</Text>
                </Section>
                <Section style={section}>
                  <Text style={label}>Effective Date:</Text>
                  <Text style={text}>{ndaDetails.effectiveDate}</Text>
                </Section>
              </>
            )}
          </>
        )}
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
  lineHeight: "24px",
  textDecoration: "none",
  display: "block",
};
