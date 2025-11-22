import { prisma } from "@/lib/db";
import { requireAdminApi } from "./require-admin-api";
import { notFound } from "next/navigation";

export async function adminGetLesson(id: string) {
  await requireAdminApi();

  const data = await prisma.lesson.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
      videoKey: true,
      thumbnailKey: true,
      description: true,
      id: true,
      position: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
