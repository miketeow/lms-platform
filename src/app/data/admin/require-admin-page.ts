import "server-only";
// Check if there is a valid user session (whether the user is logged in or not)
// Check if the user is an admin
// If both are true, return user
// If one is false, redirect the user

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/not-admin");
  }

  return session;
}
