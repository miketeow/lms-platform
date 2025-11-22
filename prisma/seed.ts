import { CourseStatus, CourseLevel } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db";

// 🔴 IMPORTANT: Before running this script, replace the ID below
// with the User ID of your actual admin account from your database.
const TEACHER_ID = "user_2lq3...";

// Helper to convert plain text to Tiptap JSON structure
const toRichText = (text: string) => {
  return JSON.stringify({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: text,
          },
        ],
      },
    ],
  });
};

async function main() {
  console.log("🌱 Seeding database...");

  const courses = [
    {
      title: "The Complete Next.js 14 Masterclass",
      slug: "nextjs-14-masterclass",
      // Wrap description in helper function
      description: toRichText(
        "Build full-stack applications with the App Router, Server Actions, and Prisma. This course takes you from zero to hero in the React ecosystem."
      ),
      smallDescription: "Master App Router, Server Actions & Prisma.",
      category: "Web Development",
      level: CourseLevel.Advanced,
      status: CourseStatus.Published,
      price: 49,
      duration: 600,
      fileKey:
        "https://images.unsplash.com/photo-1618477247222-ac594c768478?auto=format&fit=crop&w=800&q=80",
      stripePriceId: "price_dummy_nextjs",
      chapters: [
        {
          title: "Introduction to App Router",
          lessons: [
            "Understanding Server Components",
            "Routing & Layouts",
            "Loading & Error States",
          ],
        },
        {
          title: "Data Mutation",
          lessons: [
            "Server Actions Deep Dive",
            "Form Handling",
            "Revalidation",
          ],
        },
      ],
    },
    {
      title: "Rust Programming: From Zero to Production",
      slug: "rust-zero-to-production",
      description: toRichText(
        "Learn memory safety without garbage collection. We will build a high-performance web server and a CLI tool using Rust."
      ),
      smallDescription: "Build blazingly fast software with Rust.",
      category: "System Programming",
      level: CourseLevel.Intermediate,
      status: CourseStatus.Published,
      price: 39,
      duration: 480,
      fileKey:
        "https://images.unsplash.com/photo-1517055296731-a6f3472e70a7?auto=format&fit=crop&w=800&q=80",
      stripePriceId: "price_dummy_rust",
      chapters: [
        {
          title: "Getting Started",
          lessons: [
            "Cargo & Project Structure",
            "Variables & Mutability",
            "Data Types",
          ],
        },
        {
          title: "Ownership & Borrowing",
          lessons: [
            "The Stack and Heap",
            "Ownership Rules",
            "Borrow Checker Intuition",
          ],
        },
      ],
    },
    {
      title: "Advanced C Programming & Memory Management",
      slug: "advanced-c-programming",
      description: toRichText(
        "Deep dive into pointers, memory allocation, and low-level optimization. Essential for understanding how computers actually work."
      ),
      smallDescription: "Master Pointers and Memory Management.",
      category: "Computer Science",
      level: CourseLevel.Advanced,
      status: CourseStatus.Published,
      price: 29,
      duration: 300,
      fileKey:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      stripePriceId: "price_dummy_c",
      chapters: [
        {
          title: "Pointers Mastery",
          lessons: ["Pointer Arithmetic", "Void Pointers", "Function Pointers"],
        },
      ],
    },
    {
      title: "Modern UI/UX Design Principles",
      slug: "ui-ux-principles",
      description: toRichText(
        "Learn how to design beautiful interfaces that convert. We cover color theory, typography, and layout grids."
      ),
      smallDescription: "Design beautiful interfaces that users love.",
      category: "Design",
      level: CourseLevel.Beginner,
      status: CourseStatus.Draft,
      price: 19,
      duration: 120,
      fileKey:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
      stripePriceId: "price_dummy_ui",
      chapters: [
        {
          title: "Foundations",
          lessons: ["Color Theory", "Typography Rules", "Whitespace"],
        },
      ],
    },
    {
      title: "DevOps for Frontend Engineers",
      slug: "devops-frontend",
      description: toRichText(
        "Stop being scared of deployment. Learn Docker, CI/CD pipelines, and AWS basics tailored for React developers."
      ),
      smallDescription: "Docker, CI/CD & AWS for React devs.",
      category: "DevOps",
      level: CourseLevel.Intermediate,
      status: CourseStatus.Published,
      price: 59,
      duration: 400,
      fileKey:
        "https://images.unsplash.com/photo-1667372393119-c81c0e839adb?auto=format&fit=crop&w=800&q=80",
      stripePriceId: "price_dummy_devops",
      chapters: [
        {
          title: "Containerization",
          lessons: [
            "Docker Basics",
            "Dockerizing Next.js",
            "Multi-stage Builds",
          ],
        },
      ],
    },
  ];

  for (const course of courses) {
    const createdCourse = await prisma.course.create({
      data: {
        userId: TEACHER_ID,
        title: course.title,
        slug: course.slug,
        description: course.description,
        smallDescription: course.smallDescription,
        category: course.category,
        level: course.level,
        status: course.status,
        price: course.price,
        duration: course.duration,
        fileKey: course.fileKey,
        stripePriceId: course.stripePriceId,
        chapter: {
          create: course.chapters.map((chapter, cIndex) => ({
            title: chapter.title,
            position: cIndex + 1,
            lessons: {
              create: chapter.lessons.map((lesson, lIndex) => ({
                title: lesson,
                position: lIndex + 1,
                description: toRichText(
                  `This is a placeholder description for ${lesson}.`
                ),
                thumbnailKey: course.fileKey,
                videoKey: null,
              })),
            },
          })),
        },
      },
    });
    console.log(`Created course: ${createdCourse.title}`);
  }

  console.log("✅ Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
