<!-- option-1 -->
## No Authentication

**When to use**: Application doesn't require user authentication

**Configuration**: No auth-related dependencies or setup required
<!-- /option-1 -->

<!-- option-2 -->
## Magic Link Authentication

**When to use**: Selected when "Magic Link" is chosen in InitialConfiguration

**Technologies**:
- **Better-Auth** with magic link plugin
- **Resend** for email delivery

**Dependencies**:
```json
{
  "dependencies": {
    "better-auth": "latest",
    "resend": "latest"
  }
}
```

**Environment Variables**:
```env
RESEND_API_KEY="your-resend-key"
BETTER_AUTH_SECRET="your-secret"
```

**Configuration**:
```typescript
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
      },
    }),
  ],
});
```
<!-- /option-2 -->

<!-- option-3 -->
## Email & Password Authentication

**When to use**: Selected when "Email & Password" is chosen in InitialConfiguration

**Technologies**:
- **Better-Auth** with email/password
- **Resend** for verification emails

**Dependencies**:
```json
{
  "dependencies": {
    "better-auth": "latest",
    "resend": "latest"
  }
}
```

**Client usage**:
```typescript
import { signIn, signUp } from "@/lib/auth-client";

await signUp.email({
  email: "user@example.com",
  password: "securePassword123",
  name: "User Name",
});

await signIn.email({
  email: "user@example.com",
  password: "securePassword123",
});
```
<!-- /option-3 -->

<!-- option-4 -->
## OTP Authentication

**When to use**: Selected when "OTP" is chosen in InitialConfiguration

**Technologies**:
- **Better-Auth** with OTP plugin
- **Resend** for OTP delivery

**Configuration**:
```typescript
import { otp } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    otp({
      sendOTP: async ({ email, otp }) => {
      },
    }),
  ],
});
```
<!-- /option-4 -->

<!-- option-5 -->
## Two-Factor Authentication (2FA)

**When to use**: Selected when "2FA" is chosen in InitialConfiguration

**Technologies**:
- **Better-Auth** with twoFactor plugin

**Configuration**:
```typescript
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [twoFactor()],
});
```

**Client usage**:
```typescript
import { twoFactor } from "@/lib/auth-client";

await twoFactor.enable({
  password: "userPassword",
});

await twoFactor.verifyTotp({
  code: "123456",
});
```
<!-- /option-5 -->

<!-- option-6 -->
## Passkey Authentication

**When to use**: Selected when "Passkey" is chosen in InitialConfiguration

**Technologies**:
- **Better-Auth** with passkey plugin
- WebAuthn API

**Configuration**:
```typescript
import { passkey } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    passkey({
      rpName: "Your App Name",
      rpID: "yourdomain.com",
    }),
  ],
});
```
<!-- /option-6 -->

<!-- option-7 -->
## Anonymous Sessions

**When to use**: Selected when "Anonymous Sessions" is chosen in InitialConfiguration

**Technologies**:
- **Better-Auth** with anonymous plugin

**Configuration**:
```typescript
import { anonymous } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [anonymous()],
});
```

**Client usage**:
```typescript
import { signIn } from "@/lib/auth-client";

await signIn.anonymous();
```
<!-- /option-7 -->

<!-- option-8 -->
## Google OAuth

**When to use**: Selected when "Google OAuth" is chosen in InitialConfiguration

**Environment Variables**:
```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**Configuration**:
```typescript
export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

**Client usage**:
```typescript
import { signIn } from "@/lib/auth-client";

await signIn.social({
  provider: "google",
  callbackURL: "/dashboard",
});
```
<!-- /option-8 -->

<!-- option-9 -->
## GitHub OAuth

**When to use**: Selected when "GitHub OAuth" is chosen in InitialConfiguration

**Environment Variables**:
```env
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

**Configuration**:
```typescript
export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```
<!-- /option-9 -->

<!-- option-10 -->
## Apple Sign In

**When to use**: Selected when "Apple Sign In" is chosen in InitialConfiguration

**Environment Variables**:
```env
APPLE_CLIENT_ID="your-client-id"
APPLE_CLIENT_SECRET="your-client-secret"
```

**Configuration**:
```typescript
export const auth = betterAuth({
  socialProviders: {
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    },
  },
});
```
<!-- /option-10 -->

<!-- option-11 -->
## Password Only

**When to use**: Selected when "Password Only" is chosen in InitialConfiguration (no email verification)

**Configuration**:
```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});
```
<!-- /option-11 -->
