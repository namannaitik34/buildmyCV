"use client"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'January', score: 65 },
  { month: 'February', score: 72 },
  { month: 'March', score: 70 },
  { month: 'April', score: 78 },
  { month: 'May', score: 85 },
  { month: 'June', score: 88 },
];

const chartConfig = {
    score: {
        label: "Score",
        color: "hsl(var(--accent))",
    },
};

export function ResumeEffectivenessChart() {
  return (
    <div className="w-full h-[300px]">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[50, 100]}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <defs>
                    <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="score"
                    type="natural"
                    fill="url(#fillScore)"
                    fillOpacity={0.4}
                    stroke="var(--color-score)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    </div>
  );
}
