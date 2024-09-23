import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/drizzle/schema.ts",
  dialect: "postgresql",
  migrations: {
    prefix: "supabase",
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
