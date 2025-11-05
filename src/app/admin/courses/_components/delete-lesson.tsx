import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLesson } from "../[courseId]/edit/actions";
import { toast } from "sonner";

export function DeleteLesson({
  courseId,
  chapterId,
  lessonId,
}: {
  courseId: string;
  chapterId: string;
  lessonId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteLesson({ courseId, chapterId, lessonId }),
      );

      if (error) {
        toast.error("An error occurred while deleting the lesson.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this lesson?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            lesson.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={onSubmit} disabled={pending}>
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
