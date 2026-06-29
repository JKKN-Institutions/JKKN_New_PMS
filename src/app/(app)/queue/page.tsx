import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { chairtokens, patients, departments } from "@/db/schema";
import { Badge } from "@/components/ui/Badge";

function TokenCard({
  tokenNo,
  patientName,
  status,
}: {
  tokenNo: string | null;
  patientName: string;
  status: string | null;
}) {
  const s = status ?? "Waiting";
  const bg =
    s === "Done" || s === "Completed"
      ? "bg-green-50 border-green-200"
      : s === "In Progress" || s === "Called"
      ? "bg-blue-50 border-blue-200"
      : "bg-yellow-50 border-yellow-200";
  const textColor =
    s === "Done" || s === "Completed"
      ? "text-green-700"
      : s === "In Progress" || s === "Called"
      ? "text-blue-700"
      : "text-yellow-700";

  return (
    <div className={`rounded-lg border p-3 ${bg}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-lg font-bold text-gray-800">
          {tokenNo ?? "—"}
        </span>
        <span className={`text-xs font-semibold ${textColor}`}>{s}</span>
      </div>
      <p className="text-xs text-gray-600 truncate">{patientName}</p>
    </div>
  );
}

export default async function QueuePage() {
  let rows: Array<{
    id: string;
    tokenNo: string | null;
    status: string | null;
    deptName: string | null;
    patFirst: string | null;
    patLast: string | null;
  }> = [];

  try {
    const db = getDb();

    rows = await db
      .select({
        id: chairtokens.id,
        tokenNo: chairtokens.tokenNo,
        status: chairtokens.status,
        deptName: departments.name,
        patFirst: patients.firstName,
        patLast: patients.lastName,
      })
      .from(chairtokens)
      .leftJoin(departments, eq(chairtokens.departmentId, departments.id))
      .leftJoin(patients, eq(chairtokens.parentId, patients.id))
      .where(
        and(
          eq(chairtokens.deleted, 0),
          sql`DATE(token_date) = CURDATE()`
        )
      )
      .orderBy(chairtokens.tokenSerial);
  } catch {
    // DB not configured
  }

  // Group by department
  const byDept = rows.reduce(
    (acc, r) => {
      const key = r.deptName ?? "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    },
    {} as Record<string, typeof rows>
  );

  const deptKeys = Object.keys(byDept);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Token Queue Board
        </h1>
        <Badge variant="green">Live — Today</Badge>
      </div>

      {deptKeys.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
          No tokens issued today. Check back when patients are registered at
          reception.
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(deptKeys.length, 4)}, minmax(0, 1fr))`,
          }}
        >
          {deptKeys.map((dept) => {
            const tokens = byDept[dept];
            return (
              <div
                key={dept}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold truncate">{dept}</h2>
                  <span className="text-xs bg-blue-500 rounded-full px-2 py-0.5 ml-2 shrink-0">
                    {tokens.length}
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  {tokens.map((t) => (
                    <TokenCard
                      key={t.id}
                      tokenNo={t.tokenNo}
                      patientName={
                        [t.patFirst, t.patLast].filter(Boolean).join(" ") ||
                        "Unknown"
                      }
                      status={t.status}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
