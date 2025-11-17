import prisma from "@/lib/db";
import { requireAdminApi } from "./require-admin-api";

export async function adminGetDashboardStats() {
  await requireAdminApi();

  const [totalSignups, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      //total users
      prisma.user.count(),

      //total customers
      prisma.user.count({
        where: {
          enrollments: {
            some: {},
          },
        },
      }),
      //total course
      prisma.course.count(),

      //total lessons
      prisma.lesson.count(),
    ]);

  return {
    totalSignups,
    totalCustomers,
    totalCourses,
    totalLessons,
  };
}
