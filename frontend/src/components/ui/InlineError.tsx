interface InlineErrorProps {
  message?: string;
}

export const InlineError = ({ message }: InlineErrorProps) => {
  if (!message) return null;

  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
};
