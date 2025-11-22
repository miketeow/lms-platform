import { prisma } from "@/lib/db";
import { requireAdminApi } from "./require-admin-api";

export async function adminGetAllCourses() {
  await requireAdminApi();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });

  return data;
}

export type AdminAllCourseType = Awaited<
  ReturnType<typeof adminGetAllCourses>
>[0];
