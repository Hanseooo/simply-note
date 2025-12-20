import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { CustomTooltip } from "./utils/CustomTooltip";
import { useState } from "react";

type Props = {
  data: { topic: string; score: number }[];
};

export function TopicBarChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const primaryColor = "#9333ea";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
      >
        <XAxis
          dataKey="topic"
          tick={{ fontSize: 11,  }}
          angle={-45}
          textAnchor="end"
          interval={0}
          height={80}
          tickFormatter={(t) => (t.length > 20 ? t.slice(0, 18) + "…" : t)}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: primaryColor }}
          label={{
            value: "Score (%)",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 11, fill: primaryColor },
          }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar
          dataKey="score"
          radius={[6, 6, 0, 0]}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          fill={primaryColor}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fillOpacity={activeIndex === index ? 0.8 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
