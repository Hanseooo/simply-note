import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CustomTooltip } from "./utils/CustomTooltip";

type Props = {
  data: { topic: string; score: number }[];
};


export function TopicRadarChart({ data }: Props) {
    const primaryColor = "#9333ea";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="80%">
        <PolarGrid />
        <PolarAngleAxis dataKey="topic" tick={{ fontSize: 12 }} />
        <Radar
          dataKey="score"
          stroke={primaryColor}
          fill={primaryColor}
          fillOpacity={0.5}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

