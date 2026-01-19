import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seed() {
  console.log("Starting database seed...");

  const testUsers = [
    {
      email: "admin@example.com",
      password: "Password123!",
      role: "admin",
    },
    {
      email: "user1@example.com",
      password: "Password123!",
      role: "user",
    },
    {
      email: "user2@example.com",
      password: "Password123!",
      role: "user",
    },
  ];

  for (const userData of testUsers) {
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

    if (authError) {
      console.error(`Error creating user ${userData.email}:`, authError);
      continue;
    }

    console.log(`Created user: ${userData.email}`);

    if (authData.user) {
      const { error: profileError } = await supabase
        .from("users")
        .update({ role: userData.role })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error(
          `Error updating profile for ${userData.email}:`,
          profileError
        );
      }
    }
  }

  console.log("Seed complete!");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
