import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface LessonItemProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?: boolean;
  completed: boolean;
}
export function LessonItem({
  lesson,
  slug,
  isActive,
  completed,
}: LessonItemProps) {
  return (
    <Link
      className={buttonVariants({
        variant: "outline",
        className: cn(
          // Layout and size override
          "w-full p-2.5 h-auto justify-start transition-all text-sm font-medium",

          // Completed state
          completed &&
            "bg-emerald-50/50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400  dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400",
          // Active State Watching Now
          isActive &&
            !completed &&
            "bg-primary/10 border-primary/20 text-primary hover:bg-primary/15 hover:text-primary",
          // Default State (Inactive, Not Completed)
          !isActive &&
            !completed &&
            "bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground"
        ),
      })}
      href={`/dashboard/${slug}/${lesson.id}`}
    >
      <div className="flex items-center gap-2.5 w-full min-w-0">
        <div className="shrink-0">
          {completed ? (
            <div className="size-5 rounded-full bg-emerald-600/90 dark:bg-emerald-500 flex items-center justify-center shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-900">
              <Check className="size-3 text-white stroke-3" />
            </div>
          ) : (
            <div
              className={cn(
                "size-5 rounded-full border-2 bg-background flex justify-center items-center transition-colors",
                isActive
                  ? "border-primary bg-background"
                  : "border-muted-foreground/30 bg-muted/20"
              )}
            >
              <Play
                className={cn(
                  "size-2.5 fill-current",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
          )}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className={cn(" truncate", isActive && "font-semibold")}>
            {lesson.position}. {lesson.title}
          </p>
          {completed && (
            <span className="text-[10px] font-semibold text-emerald-600/80 dark:text-emerald-400 uppercase tracking-wider">
              Completed
            </span>
          )}

          {isActive && !completed && (
            <span className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider">
              Currently watching
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
