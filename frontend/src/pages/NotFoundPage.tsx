import { useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Card className="w-full max-w-md text-center shadow-2xl shadow-primary/25">
        <CardContent className="space-y-6">
          <CardTitle className="text-6xl font-extrabold text-primary">
            404
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Oops! The page you are looking for does not exist.
          </CardDescription>
          <Button onClick={() => navigate({ to: "/" })} className="w-full">
            Go Back Home
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
