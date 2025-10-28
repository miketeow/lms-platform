"use server";

import { requireAdminApi } from "@/app/data/admin/require-admin-api";
import prisma from "@/lib/db";
import { AuthError, ForbiddenError } from "@/lib/errors";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";

export async function CreateCourse(
  values: CourseSchemaType,
): Promise<ApiResponse> {
  try {
    const session = await requireAdminApi();
    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: error.message };
    }
    if (error instanceof ForbiddenError) {
      return { status: "error", message: error.message };
    }
    console.log(error);
    return {
      status: "error",
      message: "Invalid Form Data",
    };
  }
}
