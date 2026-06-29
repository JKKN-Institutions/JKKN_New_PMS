import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { sequences } from "@/db/schema";

export default async function AdminSequencesPage() {
  const db = getDb();
  const rows = await db.select().from(sequences).where(eq(sequences.deleted, 0)).orderBy(sequences.name);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Number Sequences</h1>
          <p className="text-sm text-gray-500 mt-1">Manage patient, case, and bill number format configuration</p>
        </div>
        <a href="/admin" className="text-xs text-gray-500 hover:text-gray-700">← Back to Admin</a>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{rows.length} records</span>
        </div>
        {rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sequence No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.sequenceType ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.period ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.seqNo ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
