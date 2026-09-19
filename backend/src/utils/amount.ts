/** Monto positivo y finito con hasta 2 decimales; null si es invalido. */
export function parseAmount(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : (value as number);
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}
