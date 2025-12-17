// components/cards/AddShareCodeCard.tsx

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { Plus, Link2 } from "lucide-react";
import { useFetchSummaryByCode } from "@/hooks/useFetchSummaryByCode";
import { useState } from "react";

export default function ShareCodeButtonCard() {
    const { fetchByCode, isFetching} = useFetchSummaryByCode()
    const [inputeCode, setInputCode] = useState("")
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
              <div className="mx-auto flex h-18 mb-4 w-18 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">
                Add Shared Note
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter a share code to save a note
              </p>
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
            Add note via share code
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shareCode">Share code</Label>
            <Input id="shareCode" value={inputeCode} onChange={(e) => setInputCode(e.target.value)} placeholder="e.g. JBDTE472" autoFocus />
          </div>

          <Button 
          onClick={() => fetchByCode(inputeCode)}
          disabled={isFetching}
          className="w-full">View Note</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
