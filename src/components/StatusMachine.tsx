"use client";

import { cn } from "@/lib/cn";

export interface StatusTransition {
  label: string;
  toStatus: string;
  variant?: "primary" | "danger" | "ghost";
}

interface StatusMachineProps {
  currentStatus: string;
  transitions: StatusTransition[];
  onTransition?: (toStatus: string) => void;
}

const variantStyles: Record<string, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "border border-gray-300 text-gray-700 hover:bg-gray-50",
};

export function StatusMachine({ currentStatus, transitions, onTransition }: StatusMachineProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 font-medium">Status:</span>
      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">{currentStatus}</span>
      {transitions.map((t) => (
        <button
          key={t.toStatus}
          onClick={() => onTransition?.(t.toStatus)}
          className={cn(
            "text-xs px-3 py-1.5 rounded font-medium transition-colors",
            variantStyles[t.variant ?? "primary"]
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
