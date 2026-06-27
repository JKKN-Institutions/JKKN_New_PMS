"use client";

import { usePathname } from "next/navigation";
import { RecordPage } from "@/components/RecordPage";

const TABS = [
  { key: "overview",      label: "Overview",      path: "" },
  { key: "casesheets",    label: "Case Sheets",   path: "/casesheets" },
  { key: "appointments",  label: "Appointments",  path: "/appointments" },
  { key: "treatments",    label: "Treatments",    path: "/treatments" },
  { key: "prescriptions", label: "Prescriptions", path: "/prescriptions" },
  { key: "lab",           label: "Lab",           path: "/lab" },
  { key: "billing",       label: "Billing",       path: "/billing" },
  { key: "complaints",    label: "Complaints",    path: "/complaints" },
  { key: "media",         label: "Media",         path: "/media" },
  { key: "history",       label: "History",       path: "/history" },
];

export default function PatientRecordShell({
  patientId,
  patNumber,
  status,
  children,
}: {
  patientId: string;
  patNumber: string;
  status: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const base = `/patients/${patientId}`;

  const tabs = TABS.map((t) => ({
    key: t.key,
    label: t.label,
    href: `${base}${t.path}`,
  }));

  const activeTab =
    TABS.find((t) => pathname === `${base}${t.path}`)?.key ?? "overview";

  return (
    <RecordPage
      humanNumber={`PAT-${patNumber}`}
      title="Patient 360"
      status={status}
      statusColor={status === "Active" ? "green" : "gray"}
      tabs={tabs}
      activeTab={activeTab}
    >
      {children}
    </RecordPage>
  );
}
