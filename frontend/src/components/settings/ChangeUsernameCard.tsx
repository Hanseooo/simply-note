import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InlineError } from "@/components/ui/InlineError";
import { useCheckUsername } from "@/hooks/useCheckUsername";
import { useChangeUsername } from "@/hooks/useChangeUsername";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/useAuthStore";

const MIN_LENGTH = 3;
const MAX_LENGTH = 18;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export const ChangeUsernameCard = () => {
  const currentUsername = useAuthStore((s) => s.user?.username);

  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | undefined>();

  const debouncedUsername = useDebounce(username.trim(), 1000);

  const { data: available, isFetching } = useCheckUsername(debouncedUsername);

  const { mutate, isPending } = useChangeUsername();

  const validationError = useMemo(() => {
    if (!username) return undefined;

    if (username.trim() !== username)
      return "Username cannot start or end with spaces";

    if (username.length < MIN_LENGTH)
      return `Username must be at least ${MIN_LENGTH} characters`;

    if (username.length > MAX_LENGTH)
      return `Username must be at most ${MAX_LENGTH} characters`;

    if (!USERNAME_REGEX.test(username))
      return "Only letters, numbers, and underscores are allowed";

    if (username === currentUsername)
      return "This is already your current username";

    return undefined;
  }, [username, currentUsername]);

  useEffect(() => {
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!debouncedUsername) {
      setError(undefined);
      return;
    }

    if (available?.available === false) {
      setError("This username is already taken");
    } else {
      setError(undefined);
    }
  }, [validationError, available, debouncedUsername]);

  const handleSubmit = () => {
    if (error || !available?.available) return;

    mutate(username.trim(), {
      onSuccess: () => {
        toast.success("Username updated successfully");
        setUsername("");
      },
    });
  };

const isDisabled =
  !username ||
  !!error ||
  isFetching ||
  isPending ||
  available?.available === false ||
  username.trim() !== debouncedUsername;

  return (
    <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Change Username
          </h3>
          <p className="text-sm text-muted-foreground">
            Usernames can contain letters, numbers, and underscores.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
            className="h-10"
          />

          {/* Status messages */}
          {debouncedUsername && isFetching && !validationError && (
            <p className="text-xs text-muted-foreground">
              Checking availability…
            </p>
          )}

          {!isFetching &&
            debouncedUsername &&
            available?.available &&
            !validationError && (
              <p className="text-xs text-green-600">Username is available</p>
            )}

          <InlineError message={error} />
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="font-medium"
          >
            {isPending ? "Updating…" : "Update Username"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
