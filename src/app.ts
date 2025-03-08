import { router as auth } from "@/routes/auth/auth.index";
import { router as index } from "@/routes/index.route";
import { router as users } from "@/routes/users/users.index";
import { router as workspaces } from "@/routes/workspaces/workspaces.index";
import { configureOpenApi } from "./lib/configure-open-api";
import { createApp } from "./lib/create-app";

const app = createApp();

const routes = [index, auth, users, workspaces] as const;

configureOpenApi(app);

for (const route of routes) {
	app.route("/", route);
}

export { app };
