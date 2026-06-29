import Link from "next/link";
import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { labrequests, labsetups, labsetupgroups, patients } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/Button";

const PER_PAGE = 20;

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color =
    s === "Done" || s === "Completed"
      ? "bg-green-100 text-green-700"
      : s === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : s === "Confirm" || s === "Sample"
      ? "bg-blue-100 text-blue-700"
      : s === "Cancel"
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
function Td({
  children,
  mono,
}: {
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3 whitespace-nowrap text-gray-700 ${
        mono ? "font-mono" : ""
      }`}
    >
      {children}
    </td>
  );
}

const STATUSES = ["All", "Pending", "Confirm", "Sample", "Done", "Cancel"];

export default async function LabRequestsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;
  const statusFilter = searchParams.status ?? "";

  let rows: Array<{
    id: string;
    labNumber: number | null;
    labRequestStatus: string | null;
    requestDate: Date | null;
    expDoneDate: Date | null;
    sampleName: string | null;
    testName: string | null;
    groupName: string | null;
    patFirst: string | null;
    patLast: string | null;
  }> = [];
  let total = 0;

  try {
    const db = getDb();

    const conditions = [eq(labrequests.deleted, 0)];
    if (statusFilter && statusFilter !== "All") {
      conditions.push(eq(labrequests.labRequestStatus, statusFilter));
    }

    const where = and(...conditions);

    const [rowsResult, countResult] = await Promise.all([
      db
        .select({
          id: labrequests.id,
          labNumber: labrequests.labNumber,
          labRequestStatus: labrequests.labRequestStatus,
          requestDate: labrequests.requestDate,
          expDoneDate: labrequests.expDoneDate,
          sampleName: labrequests.sampleName,
          testName: labsetups.name,
          groupName: labsetupgroups.name,
          patFirst: patients.firstName,
          patLast: patients.lastName,
        })
        .from(labrequests)
        .leftJoin(labsetups, eq(labrequests.testId, labsetups.id))
        .leftJoin(
          labsetupgroups,
          eq(labrequests.labsetupgroupId, labsetupgroups.id)
        )
        .leftJoin(patients, eq(labrequests.patientId, patients.id))
        .where(where)
        .orderBy(desc(labrequests.requestDate))
        .limit(PER_PAGE)
        .offset(offset),
      db
        .select({ total: sql<number>`COUNT(*)` })
        .from(labrequests)
        .where(where),
    ]);

    rows = rowsResult;
    total = countResult[0]?.total ?? 0;
  } catch {
    // DB not configured
  }

  const totalPages = Math.ceil(total / PER_PAGE);
  const activeStatus = statusFilter || "All";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Lab Requests
        </h1>
        <div className="flex gap-2 flex-wrap justify-end">
          <Link href="/lab/worklist">
            <Button variant="secondary" size="sm">
              Worklist
            </Button>
          </Link>
          <Button size="sm">+ New</Button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "All" ? "/lab/requests" : `/lab/requests?status=${s}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeStatus === s
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Lab #</Th>
                <Th>Patient Name</Th>
                <Th>Test Name</Th>
                <Th>Group</Th>
                <Th>Status</Th>
                <Th>Request Date</Th>
                <Th>Expected Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    No lab requests found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td mono>
                      <Link
                        href={`/lab/requests/${r.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {r.labNumber ?? "—"}
                      </Link>
                    </Td>
                    <Td>
                      {[r.patFirst, r.patLast].filter(Boolean).join(" ") ||
                        "—"}
                    </Td>
                    <Td>{r.testName ?? "—"}</Td>
                    <Td>{r.groupName ?? "—"}</Td>
                    <Td>
                      <StatusBadge status={r.labRequestStatus} />
                    </Td>
                    <Td>
                      <span className="text-xs text-gray-500">
                        {fmtDate(r.requestDate)}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-xs text-gray-500">
                        {fmtDate(r.expDoneDate)}
                      </span>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              basePath={
                activeStatus !== "All"
                  ? `/lab/requests?status=${activeStatus}`
                  : "/lab/requests"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
