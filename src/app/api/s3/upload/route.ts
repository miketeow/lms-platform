import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3client";
import { requireAdminApi } from "@/app/data/admin/require-admin-api";
import { AuthError, ForbiddenError } from "@/lib/errors";
export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "File size is required" }),
  isImage: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAdminApi();
    const body = await req.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid File Upload" },
        { status: 400 },
      );
    }

    const { fileName, contentType, size } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
      Tagging: `uploaderId=${session.user.id}`,
    });

    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 360, // URL expires in 6 minutes
    });

    const response = {
      presignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to generate presigned URL",
      },
      { status: 500 },
    );
  }
}
