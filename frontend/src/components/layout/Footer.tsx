import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full">
      <Separator />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div
          className="
            grid gap-4 text-sm text-muted-foreground
            md:grid-cols-3 md:items-center
          "
        >
          {/* Left */}
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} SimplyNote · Built by Hanseo
          </p>

          {/* Center — motivation */}
          <p className="text-center text-muted-foreground/80">
            Stay consistent. Small progress adds up.
          </p>

          {/* Right — links */}
          <div className="flex justify-center gap-1 md:justify-end">
            <Button variant="link" size="sm" asChild>
              <a
                href="https://github.com/Hanseooo"
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub
              </a>
            </Button>

            <Button variant="link" size="sm" asChild>
              <a
                href="https://hanseoo.vercel.app"
                target="_blank"
                rel="noreferrer noopener"
              >
                Portfolio
              </a>
            </Button>

            <Button variant="link" size="sm" asChild>
              <a
                href="https://www.linkedin.com/in/hanseooo"
                target="_blank"
                rel="noreferrer noopener"
              >
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
