import "server-only";
import { auth } from "@/lib/auth";
import { AuthError, ForbiddenError } from "@/lib/errors";
import { headers } from "next/headers";
import { cache } from "react";

export const requireAdmin = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new AuthError("You must be logged in to access this page");
  }

  if (session.user.role !== "admin") {
    throw new ForbiddenError("You do not have permission to access this page");
  }

  return session;
});
export async function requireAdminApi() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new AuthError("You must be logged in to access this page");
  }

  if (session.user.role !== "admin") {
    throw new ForbiddenError("You do not have permission to access this page");
  }

  return session;
}
