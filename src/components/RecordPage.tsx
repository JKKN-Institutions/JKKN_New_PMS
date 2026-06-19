import { cn } from "@/lib/cn";

export interface RecordPageTab {
  key: string;
  label: string;
  href: string;
}

interface RecordPageProps {
  humanNumber: string;
  title: string;
  status: string;
  statusColor?: "gray" | "green" | "yellow" | "red" | "blue";
  tabs?: RecordPageTab[];
  activeTab?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const statusColors: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
};

export function RecordPage({
  humanNumber,
  title,
  status,
  statusColor = "gray",
  tabs,
  activeTab,
  actions,
  children,
}: RecordPageProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 font-mono">{humanNumber}</span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColors[statusColor])}>
              {status}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {/* Tab strip */}
      {tabs && tabs.length > 0 && (
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <a
                key={tab.key}
                href={tab.href}
                className={cn(
                  "whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
