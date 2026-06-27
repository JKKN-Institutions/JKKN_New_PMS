"use client";

import { useTransition } from "react";
import { togglePatientStatusAction, deletePatientAction } from "@/app/actions/patients";

export function PatientActions({
  patientId,
  status,
}: {
  patientId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => togglePatientStatusAction(patientId, status));
  }

  function handleDelete() {
    if (window.confirm("Permanently delete this patient? This cannot be undone.")) {
      startTransition(() => deletePatientAction(patientId));
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        {status === "Active" ? "Mark Inactive" : "Mark Active"}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
