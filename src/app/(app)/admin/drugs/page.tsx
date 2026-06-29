import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { prescriptionlists, prescriptionbrands, items } from "@/db/schema";

export default async function AdminDrugsPage() {
  const db = getDb();

  const [rxLists, rxBrands, pharmaItems] = await Promise.all([
    db.select().from(prescriptionlists).where(eq(prescriptionlists.deleted, 0)).orderBy(prescriptionlists.name),
    db
      .select({
        id: prescriptionbrands.id,
        name: prescriptionbrands.name,
        categoryName: prescriptionlists.name,
      })
      .from(prescriptionbrands)
      .leftJoin(prescriptionlists, eq(prescriptionbrands.prescriptionlistId, prescriptionlists.id))
      .where(eq(prescriptionbrands.deleted, 0))
      .orderBy(prescriptionbrands.name),
    db.select().from(items).where(eq(items.deleted, 0)).orderBy(items.name),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Drug Formulary</h1>
          <p className="text-sm text-gray-500 mt-1">Manage drug categories, brands, and pharmacy inventory items</p>
        </div>
        <a href="/admin" className="text-xs text-gray-500 hover:text-gray-700">← Back to Admin</a>
      </div>

      {/* Section 1: Drug Categories (Prescription Lists) */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Drug Categories</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{rxLists.length} records</span>
        </div>
        {rxLists.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rxLists.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 2: Drug Brands */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Drug Brands</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{rxBrands.length} records</span>
        </div>
        {rxBrands.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rxBrands.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.categoryName ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section 3: Pharmacy Items */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Pharmacy Items</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">{pharmaItems.length} records</span>
        </div>
        {pharmaItems.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Billable</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Saleable</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pharmaItems.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{r.itemCode ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.measuringUnit ?? "—"}</td>
                  <td className="px-4 py-3">
                    {r.itemBill === 1 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Yes</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.isSaleable === 1 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Yes</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">No</span>
                    )}
                  </td>
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
