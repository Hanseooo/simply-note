import { Progress } from "@/components/ui/progress";

type AIQuotaProgressProps = {
  label: string;
  remaining: number;
  max: number;
  secondsUntilReset?: number;
  disabled?: boolean;
  className?: string;
};

export function AIQuotaProgress({
  label,
  remaining,
  max,
  secondsUntilReset,
  className = ""
}: AIQuotaProgressProps) {
  const percentage = Math.min((remaining / max) * 100, 100);

  return (
    <div className={`w-full sm:w-64  ${className}`} >
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>
          {remaining}/{max}
        </span>
      </div>

      <Progress className="my-2" value={percentage} />

      {remaining < max && secondsUntilReset !== undefined && (
        <p className="text-xs text-muted-foreground">
          Resets in {Math.ceil(secondsUntilReset / 60)} min
        </p>
      )}
    </div>
  );
}
