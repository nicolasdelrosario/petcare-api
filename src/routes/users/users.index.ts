import { createRouter } from "@/lib/create-app";

import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

export const router = createRouter()
	.openapi(routes.list, handlers.list)
	.openapi(routes.create, handlers.create);
