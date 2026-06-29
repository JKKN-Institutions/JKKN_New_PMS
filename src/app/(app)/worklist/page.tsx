import { and, eq, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { worksteps, worksteplists, treatments, treatmentlists } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color =
    s === "Completed" || s === "Done"
      ? "bg-green-100 text-green-700"
      : s === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : s === "Cancelled"
      ? "bg-red-100 text-red-700"
      : s === "In Progress"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {s}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{children}</td>
  );
}

export default async function WorklistPage() {
  let rows: Array<{
    id: string;
    status: string | null;
    dateEntered: Date | null;
    stepName: string | null;
    treatmentName: string | null;
  }> = [];

  try {
    const db = getDb();

    rows = await db
      .select({
        id: worksteps.id,
        status: worksteps.status,
        dateEntered: worksteps.dateEntered,
        stepName: worksteplists.name,
        treatmentName: treatmentlists.name,
      })
      .from(worksteps)
      .leftJoin(worksteplists, eq(worksteps.worksteplistId, worksteplists.id))
      .leftJoin(treatments, eq(worksteps.treatmentId, treatments.id))
      .leftJoin(treatmentlists, eq(treatments.treatmentlistId, treatmentlists.id))
      .where(and(eq(worksteps.deleted, 0), eq(worksteps.status, "Pending")))
      .orderBy(desc(worksteps.dateEntered))
      .limit(50);
  } catch {
    // DB not configured
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Worklist</h1>
        <Badge variant="yellow">
          {rows.length} Pending
        </Badge>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Pending worksteps assigned to you, grouped by patient and appointment.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Step Name</Th>
                <Th>Treatment</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    No pending worksteps found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td>{r.stepName ?? "—"}</Td>
                    <Td>{r.treatmentName ?? "—"}</Td>
                    <Td>
                      <StatusBadge status={r.status} />
                    </Td>
                    <Td>
                      <span className="text-xs text-gray-500">
                        {fmtDate(r.dateEntered)}
                      </span>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
