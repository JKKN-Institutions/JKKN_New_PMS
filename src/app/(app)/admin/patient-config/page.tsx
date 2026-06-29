import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { patientgroups, patientcategorys, insproviders, taxtypes } from "@/db/schema";

export default async function AdminPatientConfigPage() {
  const db = getDb();

  const [groups, categories, providers, taxes] = await Promise.all([
    db.select().from(patientgroups).where(eq(patientgroups.deleted, 0)).orderBy(patientgroups.name),
    db.select().from(patientcategorys).where(eq(patientcategorys.deleted, 0)).orderBy(patientcategorys.name),
    db.select().from(insproviders).where(eq(insproviders.deleted, 0)).orderBy(insproviders.name),
    db.select().from(taxtypes).where(eq(taxtypes.deleted, 0)).orderBy(taxtypes.name),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Patient Groups &amp; Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage patient groups, categories, insurance providers, and tax types</p>
        </div>
        <a href="/admin" className="text-xs text-gray-500 hover:text-gray-700">← Back to Admin</a>
      </div>

      {/* Section 1: Patient Groups */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Patient Groups</h2>
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

      {/* Section 2: Patient Categories */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Patient Categories</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{categories.length} records</span>
        </div>
        {categories.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 3: Insurance Providers */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Insurance Providers</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{providers.length} records</span>
        </div>
        {providers.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {providers.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 4: Tax Types */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Tax Types</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{taxes.length} records</span>
        </div>
        {taxes.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax (%)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {taxes.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.tax != null ? `${r.tax}%` : "—"}</td>
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
