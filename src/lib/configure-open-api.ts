import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenApi } from "@/lib/types";

import packageJSON from "../../package.json";

export function configureOpenApi(app: AppOpenApi) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: packageJSON.name,
      version: packageJSON.version,
      description: packageJSON.description,
    },
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "cookieAuth", {
    type: "apiKey",
    in: "cookie",
    name: "token",
  });

  app.get(
    "/reference",
    apiReference({
      theme: "kepler",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "axios",
      },
      spec: {
        url: "/doc",
      },
    }),
  );
}
