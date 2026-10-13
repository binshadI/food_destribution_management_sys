import { initials } from "@/lib/session";

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-forest-100 text-sm font-semibold text-forest-700 ${className ?? "size-9"}`}
    >
      {initials(name)}
    </span>
  );
}