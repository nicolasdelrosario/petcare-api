import { createRouter } from "@/lib/create-app";

import * as handlers from "./workspaces.handler";
import * as routes from "./workspaces.routes";

export const router = createRouter()
	.openapi(routes.list, handlers.list)
	.openapi(routes.create, handlers.create)
	.openapi(routes.getOne, handlers.getOne)
	.openapi(routes.patch, handlers.patch)
	.openapi(routes.remove, handlers.remove);
