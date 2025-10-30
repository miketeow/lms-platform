import "server-only";
import { requireAdminApi } from "./require-admin-api";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetCourse(courseId: string) {
  await requireAdminApi();

  const data = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      smallDescription: true,
      category: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}
