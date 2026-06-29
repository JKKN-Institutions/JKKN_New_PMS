import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { diagnosisgroups, diagnosislists, complaintlists, preproblems } from "@/db/schema";

export default async function AdminDiagnosisPage() {
  const db = getDb();

  const [dxGroups, dxLists, complaints, preproblemRows] = await Promise.all([
    db.select().from(diagnosisgroups).where(eq(diagnosisgroups.deleted, 0)).orderBy(diagnosisgroups.name),
    db
      .select({
        id: diagnosislists.id,
        name: diagnosislists.name,
        groupName: diagnosisgroups.name,
      })
      .from(diagnosislists)
      .leftJoin(diagnosisgroups, eq(diagnosislists.diagnosisgroupId, diagnosisgroups.id))
      .where(eq(diagnosislists.deleted, 0))
      .orderBy(diagnosislists.name),
    db.select().from(complaintlists).where(eq(complaintlists.deleted, 0)).orderBy(complaintlists.name),
    db.select().from(preproblems).where(eq(preproblems.deleted, 0)).orderBy(preproblems.name),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Diagnosis &amp; Complaint Catalogs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage diagnosis taxonomy, complaint lists, and medical history templates</p>
        </div>
        <a href="/admin" className="text-xs text-gray-500 hover:text-gray-700">← Back to Admin</a>
      </div>

      {/* Section 1: Diagnosis Groups */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Diagnosis Groups</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{dxGroups.length} records</span>
        </div>
        {dxGroups.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dxGroups.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 2: Diagnosis Lists */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Diagnosis Lists</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{dxLists.length} records</span>
        </div>
        {dxLists.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Group</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dxLists.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.groupName ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 3: Complaint Lists */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Complaint Lists</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{complaints.length} records</span>
        </div>
        {complaints.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 4: Medical History Templates */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Medical History Templates</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{preproblemRows.length} records</span>
        </div>
        {preproblemRows.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {preproblemRows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
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
    </div>
  );
}
