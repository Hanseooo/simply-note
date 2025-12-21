interface AuthTitleProps {
  first: string;
  second: string;
  subtitle?: string;
}

export const AuthTitle = ({ first, second, subtitle }: AuthTitleProps) => {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold tracking-tight">
        <span className="text-foreground">{first} </span>
        <span className="text-primary">{second}</span>
      </h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
};
