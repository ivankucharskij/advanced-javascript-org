import { OpenAPIHono } from "@hono/zod-openapi";
import { adminSessionResponseSchema } from "@repo/shared-types";

import { HttpStatus } from "../../shared/http.js";
import { adminOpenApi } from "./admin.openapi.js";
import { adminService } from "./admin.service.js";

export const adminRouter = new OpenAPIHono();

adminRouter.openapi(adminOpenApi.session, async (c) => {
  const result = await adminService.createSession(c.req.valid("json").code);

  if (!result.ok) {
    return c.json({ message: result.message }, result.status);
  }

  return c.json(
    adminSessionResponseSchema.parse({ data: result.data }),
    HttpStatus.OK,
  );
});
