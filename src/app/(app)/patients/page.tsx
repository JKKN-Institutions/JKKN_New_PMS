import Link from "next/link";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { patients } from "@/db/schema";
import { Button } from "@/components/ui/Button";
import { calcAge, fmtCurrency, fmtDate } from "@/lib/formatters";
import PatientListFilters from "./_components/PatientListFilters";

const PAGE_SIZE = 20;

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: { q?: string; date?: string; page?: string };
}) {
  const db = getDb();
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  // Build where conditions
  const conditions = [eq(patients.deleted, 0)];

  if (searchParams.q) {
    const q = `%${searchParams.q}%`;
    conditions.push(
      or(
        like(patients.firstName, q),
        like(patients.lastName, q),
        like(patients.phoneMobile, q),
        sql`CAST(${patients.patNumber} AS CHAR) LIKE ${q}`
      )!
    );
  }

  if (searchParams.date) {
    conditions.push(sql`DATE(${patients.regDate}) = ${searchParams.date}`);
  }

  const where = and(...conditions);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: patients.id,
        patNumber: patients.patNumber,
        salutation: patients.salutation,
        firstName: patients.firstName,
        lastName: patients.lastName,
        sex: patients.sex,
        birthdate: patients.birthdate,
        phoneMobile: patients.phoneMobile,
        status: patients.status,
        regDate: patients.regDate,
        outstandingAmt: patients.outstandingAmt,
      })
      .from(patients)
      .where(where)
      .orderBy(desc(patients.dateEntered))
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(patients)
      .where(where),
  ]);

  const totalPages = Math.ceil(Number(total) / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Patients{" "}
          <span className="text-base font-normal text-gray-400">({total})</span>
        </h1>
        <Link href="/patients/new">
          <Button size="sm">+ New Patient</Button>
        </Link>
      </div>

      <PatientListFilters />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Pat #", "Name", "Sex / Age", "Mobile", "Reg Date", "Outstanding", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No patients found.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {p.patNumber}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {[p.salutation, p.firstName, p.lastName].filter(Boolean).join(" ")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.sex || "—"}
                      {p.birthdate ? ` / ${calcAge(p.birthdate)}` : ""}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.phoneMobile || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{fmtDate(p.regDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          p.outstandingAmt && Number(p.outstandingAmt) > 0
                            ? "text-red-600 font-medium text-xs"
                            : "text-gray-400 text-xs"
                        }
                      >
                        {fmtCurrency(p.outstandingAmt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/patients/${p.id}`}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              Page {page} of {totalPages} &nbsp;·&nbsp; {total} patients
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`?${new URLSearchParams({
                    ...(searchParams.q ? { q: searchParams.q } : {}),
                    ...(searchParams.date ? { date: searchParams.date } : {}),
                    page: String(page - 1),
                  })}`}
                >
                  <Button variant="secondary" size="sm">← Prev</Button>
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`?${new URLSearchParams({
                    ...(searchParams.q ? { q: searchParams.q } : {}),
                    ...(searchParams.date ? { date: searchParams.date } : {}),
                    page: String(page + 1),
                  })}`}
                >
                  <Button variant="secondary" size="sm">Next →</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
