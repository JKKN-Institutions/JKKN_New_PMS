"use client";

import { fmtDate } from "@/lib/formatters";

interface AuditEntry {
  id: string;
  action: string;
  changedBy: string;
  changedAt: string | Date;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
}

interface AuditDrawerProps {
  open: boolean;
  onClose: () => void;
  entries: AuditEntry[];
}

export function AuditDrawer({ open, onClose, entries }: AuditDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <aside className="relative w-96 bg-white shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Audit History</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {entries.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No history available.</p>
          )}
          {entries.map((e) => (
            <div key={e.id} className="border border-gray-100 rounded-lg p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-700">{e.action}</span>
                <span className="text-gray-400">{fmtDate(e.changedAt, "dd MMM yyyy HH:mm")}</span>
              </div>
              <p className="text-gray-500">by {e.changedBy}</p>
              {e.fieldName && (
                <p className="mt-1 text-gray-600">
                  <span className="font-medium">{e.fieldName}:</span>{" "}
                  <span className="line-through text-red-400">{e.oldValue}</span>{" "}
                  → <span className="text-green-600">{e.newValue}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
