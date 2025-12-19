import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Link2, type LucideIcon } from "lucide-react";
import { useState } from "react";

type UseFetchByCodeHook = () => {
  fetchByCode: (code: string) => void;
  isFetching: boolean;
};

type AddShareCodeCardProps = {
  /** Hook to resolve share code */
  useFetchHook: UseFetchByCodeHook;

  /** Text content */
  title: string;
  description: string;
  dialogTitle: string;
  submitLabel: string;

  /** Optional icon override */
  icon?: LucideIcon;
};

export default function ShareCodeButtonCard({
  useFetchHook,
  title,
  description,
  dialogTitle,
  submitLabel,
  icon: Icon = Plus,
}: AddShareCodeCardProps) {
  const { fetchByCode, isFetching } = useFetchHook();
  const [inputCode, setInputCode] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          layout
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Card className="flex h-full flex-col justify-center border-2 border-dashed border-primary/30 bg-card/10 text-center transition hover:border-primary hover:bg-primary/5 cursor-pointer">
            <CardContent className="space-y-1">
              <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-12 w-12" />
              </div>

              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>

              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>

            <CardFooter className="w-full">
              <Button variant="outline" className="w-full">
                Enter share code
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DialogTrigger>

      {/* Dialog */}
      <DialogContent className="sm:max-w-md border-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shareCode">Share code</Label>
            <Input
              id="shareCode"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g. JBDTE472"
              autoFocus
            />
          </div>

          <Button
            onClick={() => fetchByCode(inputCode)}
            disabled={isFetching || !inputCode}
            className="w-full"
          >
            {submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
