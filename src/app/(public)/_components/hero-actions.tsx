"use client";

import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function HeroActions() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Link
        href="/courses"
        className={buttonVariants({
          size: "lg",
        })}
      >
        Explore Courses
      </Link>

      {session ? (
        <Link
          href="/dashboard"
          className={buttonVariants({
            size: "lg",
            variant: "outline",
          })}
        >
          Go to Dashboard
        </Link>
      ) : (
        <Link
          href="/login"
          className={buttonVariants({
            size: "lg",
            variant: "outline",
          })}
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
