export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter"
      className="flex gap-1 overflow-x-auto"
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap border-b-2 px-1 pb-2 pt-1 text-sm font-semibold transition ${
              selected
                ? "border-forest-600 text-forest-900"
                : "border-transparent text-charcoal-400 hover:text-forest-800"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}