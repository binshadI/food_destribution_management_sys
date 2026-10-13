import { MapPin } from "@/components/ui/icons";

export function RouteMap({
  pickup,
  dropoff,
}: {
  pickup: string;
  dropoff: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-sage-200 bg-sage-100">
      <svg
        viewBox="0 0 400 200"
        role="img"
        aria-label={`Delivery route from ${pickup} to ${dropoff}`}
        className="h-44 w-full sm:h-52"
      >
        <path
          d="M0 58h400M0 142h400M92 0v200M268 0v200"
          stroke="#d8e3d2"
          strokeWidth="10"
          fill="none"
        />
        <path
          d="M0 58h400M0 142h400M92 0v200M268 0v200"
          stroke="#f3f6f1"
          strokeWidth="2"
          strokeDasharray="10 12"
          fill="none"
        />
        <path
          d="M64 58C64 108 92 142 160 142c68 0 76-84 144-84"
          stroke="#2f8456"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="2 12"
          fill="none"
        />
        <circle cx="64" cy="58" r="10" fill="#2f8456" />
        <circle cx="64" cy="58" r="4" fill="#f1fbf4" />
        <circle cx="304" cy="58" r="10" fill="#1b5236" />
        <circle cx="304" cy="58" r="4" fill="#f1fbf4" />
        <circle cx="160" cy="142" r="13" fill="#ef9120" opacity="0.25" />
        <circle cx="160" cy="142" r="6" fill="#ef9120" stroke="#fff" strokeWidth="2" />
      </svg>

      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-semibold text-forest-800 shadow-soft">
        <MapPin className="size-3.5 text-forest-600" />
        {pickup}
      </span>
      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-semibold text-forest-800 shadow-soft">
        <MapPin className="size-3.5 text-forest-600" />
        {dropoff}
      </span>
    </div>
  );
}
