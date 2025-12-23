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
import { LogOut, User, LucideMessageCircleQuestionMark, Settings, Home, Notebook, Map, PenBoxIcon, MessagesSquare, ShieldUser } from "lucide-react";
import { motion } from "framer-motion";
import { useLogout } from "@/hooks/useLogout";
import { useNavigate } from "@tanstack/react-router";

export default function Navbar() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const navigate = useNavigate();

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

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full px-2"
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

              {/* Mobile-only nav links */}
              <div className="md:hidden">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/home" })}
                  className="cursor-pointer"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate({ to: "/notes" })}
                  className="cursor-pointer"
                >
                  <Notebook className="mr-2 h-4 w-4" />
                  Notes
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate({ to: "/quizzes" })}
                  className="cursor-pointer"
                >
                  <PenBoxIcon className="mr-2 h-4 w-4" />
                  Quizzes
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate({ to: "/roadmaps" })}
                  className="cursor-pointer"
                >
                  <Map className="mr-2 h-4 w-4" />
                  Roadmaps
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate({ to: "/settings/account" })}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate({ to: "/about" })}
                className="cursor-pointer"
              >
                <LucideMessageCircleQuestionMark className="mr-2 h-4 w-4" />{" "}
                About
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate({ to: "/feedback" })}
                className="cursor-pointer"
              >
                <MessagesSquare className="mr-2 h-4 w-4" /> Feedback
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {(user?.email == "amoguishans@gmail.com" ||
                user?.email == "hansqdyt@gmail.com") && (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/feedback/admin" })}
                    className="cursor-pointer"
                  >
                    <ShieldUser className="mr-2 h-4 w-4" /> Admin Feedback
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </>
              )}

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
    </nav>
  );
}
