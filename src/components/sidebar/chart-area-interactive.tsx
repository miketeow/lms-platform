"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

export const description = "An interactive area chart";

// const dummyEnrollmentData = [
//   { date: "2024-05-01", enrollment: 50 },
//   { date: "2024-05-02", enrollment: 53 },
//   { date: "2024-05-03", enrollment: 51 },
//   { date: "2024-05-04", enrollment: 56 },
//   { date: "2024-05-05", enrollment: 55 },
//   { date: "2024-05-06", enrollment: 60 },
//   { date: "2024-05-07", enrollment: 63 },
//   { date: "2024-05-08", enrollment: 59 }, // Decrease
//   { date: "2024-05-09", enrollment: 57 }, // Decrease
//   { date: "2024-05-10", enrollment: 65 },
//   { date: "2024-05-11", enrollment: 68 },
//   { date: "2024-05-12", enrollment: 70 },
//   { date: "2024-05-13", enrollment: 66 }, // Decrease
//   { date: "2024-05-14", enrollment: 71 },
//   { date: "2024-05-15", enrollment: 75 },
//   { date: "2024-05-16", enrollment: 72 }, // Decrease
//   { date: "2024-05-17", enrollment: 69 }, // Decrease
//   { date: "2024-05-18", enrollment: 74 },
//   { date: "2024-05-19", enrollment: 80 },
//   { date: "2024-05-20", enrollment: 77 }, // Decrease
//   { date: "2024-05-21", enrollment: 81 },
//   { date: "2024-05-22", enrollment: 85 },
//   { date: "2024-05-23", enrollment: 82 }, // Decrease
//   { date: "2024-05-24", enrollment: 79 }, // Decrease
//   { date: "2024-05-25", enrollment: 83 },
//   { date: "2024-05-26", enrollment: 88 },
//   { date: "2024-05-27", enrollment: 91 },
//   { date: "2024-05-28", enrollment: 87 }, // Decrease
//   { date: "2024-05-29", enrollment: 90 },
//   { date: "2024-05-30", enrollment: 95 },
// ];

const chartConfig = {
  enrollment: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: { date: string; enrollment: number }[];
  id?: string;
}
export function ChartAreaInteractive({
  data,
  id = "enrollment-chart",
}: ChartAreaInteractiveProps) {
  const totalEnrollmentsNumber = useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollment, 0),
    [data]
  );
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrollments for the last 30 days: {totalEnrollmentsNumber}
          </span>
          <span className="@[540px]/card:hidden">
            Last 30 days: {totalEnrollmentsNumber}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px]"
          id={id}
        >
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={"enrollment"} fill="var(--color-enrollment)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
