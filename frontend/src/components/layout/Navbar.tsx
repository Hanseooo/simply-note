import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLogout } from "@/hooks/useLogout";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Notes", path: "/notes" },
    { name: "Quizzes", path: "/quizzes" },
    { name: "Roadmaps", path: "/roadmaps" },
  ];

  return (
    <nav
      className={`w-full border-b border-primary z-50 bg-linear-to-b from-background/5 via-neutral-800/5 backdrop-blur-md to-primary/10 ${
        user ? "fixed" : "hidden"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left — App name */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-bold text-primary text-md md:text-lg cursor-pointer"
          onClick={() => navigate({ to: "/home" })}
        >
          Simply Note
        </motion.div>

        {/* Center — Desktop nav links */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              size="sm"
              className="rounded-md px-3 text-muted-foreground"
              onClick={() => navigate({ to: link.path })}
            >
              {link.name}
            </Button>
          ))}
        </div>

        {/* Right — Desktop user dropdown & Mobile menu button */}
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Desktop user dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hidden md:flex items-center gap-2 rounded-full px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.username}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => logout.mutate()}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile nav menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/50 backdrop-blur-md border-t border-primary">
          <div className="flex flex-col  px-4 py-2 gap-2">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                className="w-full justify-end text-muted-foreground"
                onClick={() => {
                  navigate({ to: link.path });
                  setMobileOpen(false);
                }}
              >
                {link.name}
              </Button>
            ))}

            {/* Mobile Settings & Logout buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-primary">
              <Button
                variant="ghost"
                className="w-full justify-end text-muted-foreground"
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-end text-destructive"
                onClick={() => logout.mutate()}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
