import { type FC } from "react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color?: string;
    payload: {
      topic: string;
      score: number;
    };
  }>;
  label?: string;
}

export const CustomTooltip: FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const value = payload[0].value;

  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg px-3 py-2 shadow-lg">
      <div className="font-medium text-sm mb-1">{label}</div>
      <div className="text-primary font-semibold text-sm">{value}%</div>
    </div>
  );
};
