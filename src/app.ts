import { router as index } from "@/routes/index.route";
import { configureOpenApi } from "./lib/configure-open-api";
import { createApp } from "./lib/create-app";

const app = createApp();

const routes = [index] as const;

configureOpenApi(app);

for (const route of routes) {
	app.route("/", route);
}

export { app };
