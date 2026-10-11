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
      <path
        d="M4 17.5h24a12 12 0 0 1-24 0Z"
        fill="currentColor"
        opacity="0.95"
      />
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

export function Sprout(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21v-7" />
      <path d="M12 14c0-3.3-2.7-6-6-6-.4 3.9 2.3 6 6 6Z" />
      <path d="M12 14c0-3.6 2.9-6.5 6.5-6.5.4 4.2-2.5 6.5-6.5 6.5Z" />
    </svg>
  );
}

export function HandHeart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M11 13.5 8.3 11a1.8 1.8 0 0 1 2.6-2.6l1.1 1.1 1.1-1.1a1.8 1.8 0 0 1 2.6 2.6L13 13.5" />
      <path d="M3.5 12.5v6a1.5 1.5 0 0 0 1.5 1.5h.5" />
      <path d="M20.5 12.5v6a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5v-3" />
      <path d="M7 20v-7" />
      <path d="M20.5 20v-7" />
    </svg>
  );
}

export function Truck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 7.5h10v8h-10z" />
      <path d="M12.5 10.5H17l3 3v2.5h-7.5z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
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

export function Check(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
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

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function QuoteGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 48 36" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M0 36V20.6C0 9 6.6 1.8 17.4 0l2.2 5.6C13.4 7.4 9.8 11.2 9.8 16h7.6v20H0Zm27.6 0V20.6C27.6 9 34.2 1.8 45 0l2.2 5.6C41 7.4 37.4 11.2 37.4 16h7.6v20h-17Z" />
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

export function MapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s6.5-5.4 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </svg>
  );
}

export function Facebook(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.63c-.29-.04-1.27-.13-2.41-.13-2.39 0-4.03 1.46-4.03 4.14v2.31H7.5V13h2.76v8h3.24Z" />
    </svg>
  );
}

export function Instagram(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.2c-2.66 0-3 .01-4.04.06-1.04.05-1.75.21-2.37.46-.64.25-1.19.58-1.73 1.12-.54.54-.87 1.09-1.12 1.73-.25.62-.41 1.33-.46 2.37C2.21 9 2.2 9.34 2.2 12s.01 3 .06 4.04c.05 1.04.21 1.75.46 2.37.25.64.58 1.19 1.12 1.73.54.54 1.09.87 1.73 1.12.62.25 1.33.41 2.37.46 1.04.05 1.38.06 4.04.06s3-.01 4.04-.06c1.04-.05 1.75-.21 2.37-.46.64-.25 1.19-.58 1.73-1.12.54-.54.87-1.09 1.12-1.73.25-.62.41-1.33.46-2.37.05-1.04.06-1.38.06-4.04s-.01-3-.06-4.04c-.05-1.04-.21-1.75-.46-2.37a4.8 4.8 0 0 0-1.12-1.73 4.8 4.8 0 0 0-1.73-1.12c-.62-.25-1.33-.41-2.37-.46C15 2.21 14.66 2.2 12 2.2Zm0 1.8c2.62 0 2.93.01 3.96.06.96.04 1.48.2 1.82.34.46.18.79.39 1.13.73.34.34.55.67.73 1.13.13.34.3.86.34 1.82.05 1.03.06 1.34.06 3.96s-.01 2.93-.06 3.96c-.04.96-.2 1.48-.34 1.82-.18.46-.39.79-.73 1.13-.34.34-.67.55-1.13.73-.34.13-.86.3-1.82.34-1.03.05-1.34.06-3.96.06s-2.93-.01-3.96-.06c-.96-.04-1.48-.2-1.82-.34a3 3 0 0 1-1.13-.73 3 3 0 0 1-.73-1.13c-.13-.34-.3-.86-.34-1.82-.05-1.03-.06-1.34-.06-3.96s.01-2.93.06-3.96c.04-.96.2-1.48.34-1.82.18-.46.39-.79.73-1.13.34-.34.67-.55 1.13-.73.34-.13.86-.3 1.82-.34C9.07 4.01 9.38 4 12 4Zm0 3.06A4.94 4.94 0 1 0 12 17a4.94 4.94 0 0 0 0-9.88Zm0 8.15A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4Zm6.28-8.35a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z" />
    </svg>
  );
}

export function Linkedin(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05c.53-1 1.83-2.05 3.77-2.05C21.1 8.59 22 10.7 22 14.06V21h-4v-6.15c0-1.47-.03-3.35-2.04-3.35-2.05 0-2.36 1.6-2.36 3.25V21h-4V9Z" />
    </svg>
  );
}

export function XSocial(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.53 3H20.5l-6.49 7.42L21.5 21h-6.02l-4.72-6.17L5.36 21H2.39l6.94-7.93L2.5 3h6.17l4.27 5.64L17.53 3Zm-1.06 16.2h1.65L7.6 4.72H5.83L16.47 19.2Z" />
    </svg>
  );
}
