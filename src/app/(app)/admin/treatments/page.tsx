import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { treatmentgroups, treatmentlists, worksteplists, departments } from "@/db/schema";

export default async function AdminTreatmentsPage() {
  const db = getDb();

  const [groups, lists, worksteps] = await Promise.all([
    db.select().from(treatmentgroups).where(eq(treatmentgroups.deleted, 0)).orderBy(treatmentgroups.name),
    db
      .select({
        id: treatmentlists.id,
        name: treatmentlists.name,
        units: treatmentlists.units,
        duration: treatmentlists.duration,
        status: treatmentlists.status,
        departmentName: departments.name,
      })
      .from(treatmentlists)
      .leftJoin(departments, eq(treatmentlists.departmentId, departments.id))
      .where(eq(treatmentlists.deleted, 0))
      .orderBy(treatmentlists.name),
    db.select().from(worksteplists).where(eq(worksteplists.deleted, 0)).orderBy(worksteplists.seqNo),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Treatment Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">Manage treatment groups, lists, and work step configuration</p>
        </div>
        <a href="/admin" className="text-xs text-gray-500 hover:text-gray-700">← Back to Admin</a>
      </div>

      {/* Section 1: Treatment Groups */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Treatment Groups</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{groups.length} records</span>
        </div>
        {groups.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groups.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 2: Treatment Lists */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Treatment Lists</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{lists.length} records</span>
        </div>
        {lists.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Units</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration (days)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lists.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.departmentName ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.units ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.duration ?? "—"}</td>
                  <td className="px-4 py-3">
                    {r.status === "Active" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{r.status ?? "Inactive"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 3: Work Step Lists */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Work Step Lists</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{worksteps.length} records</span>
        </div>
        {worksteps.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seq No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Approval Required</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {worksteps.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.seqNo ?? "—"}</td>
                  <td className="px-4 py-3">
                    {r.status === "Active" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{r.status ?? "Inactive"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.approvalRequired === 1 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Yes</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.noOfDays ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
