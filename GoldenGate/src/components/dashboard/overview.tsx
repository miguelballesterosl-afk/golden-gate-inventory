'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';

const data = [
  { name: 'Ene', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Feb', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Mar', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Abr', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'May', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Jun', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Jul', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Ago', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Sep', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Oct', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Nov', total: Math.floor(Math.random() * 50000000) + 10000000 },
  { name: 'Dic', total: Math.floor(Math.random() * 50000000) + 10000000 },
];

const chartConfig = {
    total: {
      label: 'Ventas',
      color: 'hsl(var(--primary))',
    },
};

export function Overview() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${new Intl.NumberFormat('es-CO', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}`}
        />
        <Tooltip
            cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
            content={<ChartTooltipContent formatter={(value) => `$${new Intl.NumberFormat('es-CO').format(value as number)}`} />}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
