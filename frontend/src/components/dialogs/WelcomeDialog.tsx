"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WelcomeDialog() {
  const user = useAuthStore().user?.username;
  const [isOpen, setIsOpen] = useState(false);

  // Show dialog only once per session
  useEffect(() => {
    const seen = sessionStorage.getItem("welcomeDialogSeen");
    if (!seen) setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("welcomeDialogSeen", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-w-lg w-full p-6 rounded-2xl bg-linear-20 backdrop-blur-lg from-background via-background/50 to-primary/25 border border-primary shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl text-primary font-bold">
                  Welcome{" "}
                  <span className="font-bold">{user ? user : "there"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Thank you for trying out{" "}
                  <span className="font-medium">Simply Note</span>. This has
                  been a great 7-day project for me, and I enjoyed developing
                  and testing this platform.
                </p>
                <p>
                  This platform is designed to help{" "}
                  <span className="font-medium">students</span> and{" "}
                  <span className="font-medium">learners</span> have an easier
                  and smoother learning experience. It is completely{" "}
                  <span className="font-medium">free</span>, but please use the
                  platform considerately since server and cloud compute resources are
                  limited, and running features like the{" "}
                  <span className="font-medium">quiz generator</span> consumes
                  resources.
                </p>
                <p>
                  I appreciate your understanding and hope you enjoy using the
                  platform. Have a great day!
                </p>

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleClose}
                    className="font-semibold"
                  >
                    I Understand
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
