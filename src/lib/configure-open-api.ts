import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenApi } from "@/lib/types";

import packageJSON from "../../package.json";

export function configureOpenApi(app: AppOpenApi) {
	app.doc("/doc", {
		openapi: "3.0.0",
		info: {
			version: packageJSON.version,
			title: packageJSON.name,
		},
	});

	app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
		type: "http",
		scheme: "bearer",
		bearerFormat: "JWT",
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
