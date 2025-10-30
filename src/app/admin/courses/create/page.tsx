import { buttonVariants } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requireAdminPage } from "@/app/data/admin/require-admin-page";
import CourseForm from "../_components/course-form";

export default async function CourseCreationPage() {
  await requireAdminPage();
  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold">Create Course</h1>
      </div>

      <CourseForm />
    </>
  );
}
