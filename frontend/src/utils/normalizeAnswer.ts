// utils/normalizeAnswer.ts
export function normalizeAnswer(
  value: string | boolean | null
): string | boolean | null {
  if (typeof value === "string") {
    return value.trim().toLowerCase();
  }
  return value;
}
