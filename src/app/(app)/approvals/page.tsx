import Link from "next/link";
import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { approveworksteps, worksteplists, departments, users } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color =
    s === "Approved"
      ? "bg-green-100 text-green-700"
      : s === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : s === "Rejected"
      ? "bg-red-100 text-red-700"
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

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status ?? "Pending";

  let rows: Array<{
    id: string;
    status: string | null;
    requestDate: Date | null;
    stepName: string | null;
    deptName: string | null;
    reqFirstName: string | null;
    reqLastName: string | null;
  }> = [];
  let pendingCount = 0;

  try {
    const db = getDb();

    const conditions = [eq(approveworksteps.deleted, 0)];
    if (statusFilter && statusFilter !== "All") {
      conditions.push(eq(approveworksteps.status, statusFilter));
    }

    const [rowsResult, pendingResult] = await Promise.all([
      db
        .select({
          id: approveworksteps.id,
          status: approveworksteps.status,
          requestDate: approveworksteps.requestDate,
          stepName: worksteplists.name,
          deptName: departments.name,
          reqFirstName: users.firstName,
          reqLastName: users.lastName,
        })
        .from(approveworksteps)
        .leftJoin(
          worksteplists,
          eq(approveworksteps.workstepId, worksteplists.id)
        )
        .leftJoin(
          departments,
          eq(approveworksteps.departmentId, departments.id)
        )
        .leftJoin(users, eq(approveworksteps.requestedById, users.id))
        .where(and(...conditions))
        .orderBy(desc(approveworksteps.requestDate))
        .limit(100),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(approveworksteps)
        .where(
          and(
            eq(approveworksteps.deleted, 0),
            eq(approveworksteps.status, "Pending")
          )
        ),
    ]);

    rows = rowsResult;
    pendingCount = pendingResult[0]?.count ?? 0;
  } catch {
    // DB not configured
  }

  const tabs = ["Pending", "All"];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Faculty Approval Queue
        </h1>
        <Badge variant={pendingCount > 0 ? "red" : "green"}>
          {pendingCount} Pending
        </Badge>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Workstep approval requests from UG/PG students. Approving a step
        unlocks progression and enables billing.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/approvals?status=${tab}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              statusFilter === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Request Date</Th>
                <Th>Step Name</Th>
                <Th>Requested By</Th>
                <Th>Department</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    No approval requests found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td>
                      <span className="text-xs text-gray-500">
                        {fmtDate(r.requestDate)}
                      </span>
                    </Td>
                    <Td>{r.stepName ?? "—"}</Td>
                    <Td>
                      {[r.reqFirstName, r.reqLastName]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </Td>
                    <Td>{r.deptName ?? "—"}</Td>
                    <Td>
                      <StatusBadge status={r.status} />
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
