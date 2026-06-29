import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { patients, departments } from "@/db/schema";
import { PatientBanner } from "@/components/PatientBanner";
import { createCasesheetAction } from "@/app/actions/casesheets";

export default async function NewCasesheetPage({ params }: { params: { id: string } }) {
  const db = getDb();

  const [patient] = await db
    .select({
      id: patients.id,
      patNumber: patients.patNumber,
      firstName: patients.firstName,
      lastName: patients.lastName,
      sex: patients.sex,
      birthdate: patients.birthdate,
      bloodGrp: patients.bloodGrp,
      phoneMobile: patients.phoneMobile,
      outstandingAmt: patients.outstandingAmt,
    })
    .from(patients)
    .where(eq(patients.id, params.id))
    .limit(1);

  if (!patient) notFound();

  const depts = await db
    .select({ id: departments.id, name: departments.name })
    .from(departments)
    .where(eq(departments.deleted, 0))
    .orderBy(departments.name);

  async function handleCreate(formData: FormData) {
    "use server";
    await createCasesheetAction(null, formData);
  }

  return (
    <div>
      <PatientBanner patient={patient} className="mb-5" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">New Case Sheet</h2>
          <a href={`/patients/${params.id}/casesheets`} className="text-xs text-gray-500 hover:text-gray-700">
            ← Back
          </a>
        </div>

        <form action={handleCreate} className="space-y-4">
          <input type="hidden" name="patient_id" value={params.id} />

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
            <select
              name="department_id"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select department</option>
              {depts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Case Sheet Type</label>
            <select
              name="casesheet_type"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
              <option value="Staff">Staff</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Treatment Type</label>
            <select
              name="treatment_type"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select treatment type</option>
              <option value="New">New</option>
              <option value="Review">Review</option>
              <option value="Emergency">Emergency</option>
              <option value="Followup">Follow-up</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Case Sheet Date</label>
            <input
              type="date"
              name="casesheet_date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Case Sheet
            </button>
            <a
              href={`/patients/${params.id}/casesheets`}
              className="flex-1 text-center border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
