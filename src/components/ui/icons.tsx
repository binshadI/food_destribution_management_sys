import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BrandMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path d="M4 17.5h24a12 12 0 0 1-24 0Z" fill="currentColor" opacity="0.95" />
      <path
        d="M16 3c1.7 2.3 3.4 4 3.4 6.1A3.4 3.4 0 0 1 16 12.5a3.4 3.4 0 0 1-3.4-3.4C12.6 7 14.3 5.3 16 3Z"
        fill="#fff"
        opacity="0.85"
      />
      <path
        d="M16 12.5V3"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function Grid(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
  );
}

export function ClipboardList(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2.5" />
      <path d="M9 4.5V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5v1" />
      <path d="M9 11h6M9 15h6M9 7.5h3" />
    </svg>
  );
}

export function Calendar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function HeartHandshake(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M11 13.5 8.3 11a1.8 1.8 0 0 1 2.6-2.6l1.1 1.1 1.1-1.1a1.8 1.8 0 0 1 2.6 2.6L13 13.5" />
      <path d="M3.5 12.5v6a1.5 1.5 0 0 0 1.5 1.5h.5" />
      <path d="M20.5 12.5v6a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5v-3" />
      <path d="M7 20v-7M20.5 20v-7" />
    </svg>
  );
}

export function MessageCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.5 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 20.5 12Z" />
    </svg>
  );
}

export function Settings(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M4.2 7l2.6 1.5M17.2 15.5 19.8 17M4.2 17l2.6-1.5M17.2 8.5 19.8 7" />
    </svg>
  );
}

export function Bell(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5Z" />
      <path d="M13.7 19a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function HelpCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2-2.4 3.3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function Download(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v10" />
      <path d="m8 11 4 4 4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s6.5-5.4 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
    </svg>
  );
}

export function Leaf(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 19.5C4.5 11 10 5.5 19.5 5.5c0 9.5-5.5 15-14 15Z" />
      <path d="M4.5 19.5C8 16 12 12.5 16.5 10.5" />
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function Utensils(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3v7a2.5 2.5 0 0 0 5 0V3" />
      <path d="M9.5 10v11" />
      <path d="M17.5 3c-1.6 0-2.5 1.6-2.5 4s.9 3 2.5 3V3Z" />
      <path d="M17.5 10v11" />
    </svg>
  );
}

export function Box(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4Z" />
      <path d="M3.5 7.5 12 11l8.5-3.5M12 11v9.5" />
    </svg>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.2 5 5.8v5.4c0 4.2 2.9 8 7 9.6 4.1-1.6 7-5.4 7-9.6V5.8Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </svg>
  );
}

export function Info(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Inbox(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 13 6 5h12l2.5 8v4a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" />
      <path d="M3.5 13h4l1.5 2.5h6L16.5 13h4" />
    </svg>
  );
}

export function Eye(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOff(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.9 5.8A9.3 9.3 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.7" />
      <path d="M6.4 6.9A16.2 16.2 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 3.9-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="m3.5 3.5 17 17" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 5.5L20 7" />
    </svg>
  );
}

export function Truck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 6h11v10h-11z" />
      <path d="M13.5 9h4l3 3.5V16h-7" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

export function TrendingUp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3.5 17 5.5-5.5 3.5 3.5 7-7" />
      <path d="M13.5 8h6v6" />
    </svg>
  );
}

export function AlertTriangle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 21.5 20h-19Z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  );
}

export function CheckCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.2 2.7 2.7 5.3-5.6" />
    </svg>
  );
}

export function Navigation(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 11 20.5 4l-7 16.5-2.3-6.8Z" />
      <path d="m11.2 13.7 3.6-3.6" />
    </svg>
  );
}
