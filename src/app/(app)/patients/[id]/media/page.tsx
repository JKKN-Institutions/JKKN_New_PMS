import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { patientimages } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";
import { UploadForm } from "./_components/UploadForm";

const PER_PAGE = 30;

export default async function PatientMediaPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const db = getDb();
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;

  const [images, [{ total }]] = await Promise.all([
    db
      .select({
        id: patientimages.id,
        name: patientimages.name,
        fileName: patientimages.fileName,
        fileExtension: patientimages.fileExtension,
        photographType: patientimages.photographType,
        dateUpload: patientimages.dateUpload,
        isConsent: patientimages.isConsent,
        printInReport: patientimages.printInReport,
      })
      .from(patientimages)
      .where(and(eq(patientimages.patientId, params.id), eq(patientimages.deleted, 0)))
      .orderBy(desc(patientimages.dateEntered))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(patientimages)
      .where(and(eq(patientimages.patientId, params.id), eq(patientimages.deleted, 0))),
  ]);

  const totalPages = Math.ceil(Number(total) / PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Media <span className="font-normal text-gray-400">({total})</span>
        </h2>
      </div>

      <UploadForm patientId={params.id} />

      {images.length === 0 ? (
        <EmptyState message="No media files uploaded for this patient." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>File Name</Th><Th>Category</Th><Th>Ext</Th><Th>Upload Date</Th><Th>Consent</Th><Th>In Report</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {images.map((img) => (
                  <tr key={img.id} className="hover:bg-gray-50">
                    <Td>
                      {img.fileName ? (
                        <a
                          href={`/uploads/patientimages/${img.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {img.name || img.fileName}
                        </a>
                      ) : (
                        img.name || "—"
                      )}
                    </Td>
                    <Td>{img.photographType || "—"}</Td>
                    <Td>
                      {img.fileExtension ? (
                        <span className="uppercase text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                          {img.fileExtension}
                        </span>
                      ) : "—"}
                    </Td>
                    <Td>{fmtDate(img.dateUpload)}</Td>
                    <Td>
                      <span className={img.isConsent ? "text-green-600 font-medium" : "text-gray-400"}>
                        {img.isConsent ? "Yes" : "No"}
                      </span>
                    </Td>
                    <Td>
                      <span className={img.printInReport ? "text-blue-600 font-medium" : "text-gray-400"}>
                        {img.printInReport ? "Yes" : "No"}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={Number(total)} basePath={`/patients/${params.id}/media`} />
        </>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">{message}</div>;
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{children}</td>;
}
