"use client";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/render-description";
import { Button } from "@/components/ui/button";
import { constructS3Url } from "@/lib/utils";
import { BookIcon, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { markLessonComplete } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

interface CourseContentProps {
  data: LessonContentType;
}

function VideoPlayer({
  thumbnailKey,
  videoKey,
}: {
  thumbnailKey: string;
  videoKey: string;
}) {
  const videoUrl = constructS3Url(videoKey);
  const thumbnailUrl = constructS3Url(thumbnailKey);

  if (!videoKey) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center flex-col">
        <BookIcon className="size-16 text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">
          This lesson does not have a video yet.
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
      <video
        className="w-full h-full object-cover"
        controls
        poster={thumbnailUrl}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function CourseContent({ data }: CourseContentProps) {
  const [isPending, startTransition] = useTransition();
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonComplete(data.id, data.chapter.course.slug)
      );

      if (error) {
        toast.error("Failed to mark lesson as complete");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />
      <div className="py-4 border-b">
        {data.lessonProgress.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:text-green-600"
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button variant="outline" onClick={onSubmit} disabled={isPending}>
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as Complete
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}
