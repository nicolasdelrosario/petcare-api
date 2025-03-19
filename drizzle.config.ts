import { defineConfig } from "drizzle-kit";

// biome-ignore lint/style/noDefaultExport: Drizzle Kit needs a default export to properly load the config file.
export default defineConfig({
  dialect: "sqlite",
  schema: "src/db/schemas",
});
