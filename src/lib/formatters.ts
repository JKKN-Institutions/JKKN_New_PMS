import { differenceInYears, format } from "date-fns";

export function calcAge(birthdate: Date | string | null): string {
  if (!birthdate) return "—";
  const d = typeof birthdate === "string" ? new Date(birthdate) : birthdate;
  return `${differenceInYears(new Date(), d)}y`;
}

export function fmtDate(d: Date | string | null, fmt = "dd MMM yyyy"): string {
  if (!d) return "—";
  return format(typeof d === "string" ? new Date(d) : d, fmt);
}

export function fmtCurrency(amt: number | string | null): string {
  if (amt === null || amt === undefined) return "₹0.00";
  return `₹${Number(amt).toFixed(2)}`;
}

export function fullName(
  parts: { salutation?: string | null; first_name?: string | null; last_name?: string | null }
): string {
  return [parts.salutation, parts.first_name, parts.last_name]
    .filter(Boolean)
    .join(" ");
}
