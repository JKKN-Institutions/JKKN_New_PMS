import { Button } from "@/components/ui/Button";

export default function NewPatientPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <a href="/patients" className="text-sm text-gray-500 hover:text-gray-700">← Patients</a>
        <h1 className="text-2xl font-semibold text-gray-900">New Patient Registration</h1>
      </div>

      <form className="space-y-6">
        {/* Identity */}
        <Section title="Identity">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Salutation" name="salutation" as="select">
              <option value="">—</option>
              {["Mr.", "Mrs.", "Ms.", "Dr.", "Master", "Baby"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Field>
            <Field label="First Name" name="first_name" required />
            <Field label="Last Name" name="last_name" />
            <Field label="Sex" name="sex" as="select">
              <option value="">—</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Field>
            <Field label="Date of Birth" name="birthdate" type="date" />
            <Field label="Blood Group" name="blood_grp" as="select">
              {["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                <option key={g} value={g}>{g || "—"}</option>
              ))}
            </Field>
            <Field label="Father's Name" name="father_name" className="md:col-span-2" />
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Mobile (Primary)" name="phone_mobile" type="tel" required />
            <Field label="Phone (Home)" name="phone_home" type="tel" />
            <Field label="Phone (Work)" name="phone_work" type="tel" />
            <Field label="Email" name="email_address" type="email" className="md:col-span-2" />
          </div>
        </Section>

        {/* Address */}
        <Section title="Address">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Street" name="street" className="md:col-span-3" />
            <Field label="City" name="city" />
            <Field label="District" name="district" />
            <Field label="State" name="state" />
            <Field label="Postal Code" name="postalcode" />
            <Field label="Country" name="country" />
          </div>
        </Section>

        {/* Classification */}
        <Section title="Classification">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Patient Group" name="patient_group_id" as="select">
              <option value="">— Select —</option>
            </Field>
            <Field label="Patient Category" name="patientcategory_id" as="select">
              <option value="">— Select —</option>
            </Field>
            <Field label="Occupation" name="occupationlist_id" as="select">
              <option value="">— Select —</option>
            </Field>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mt-2 cursor-pointer">
                <input type="checkbox" name="vip_patient" className="rounded" />
                VIP Patient
              </label>
            </div>
          </div>
        </Section>

        {/* Referral / Insurance */}
        <Section title="Referral &amp; Insurance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Referral Source" name="refral_id" as="select">
              <option value="">— None —</option>
            </Field>
            <Field label="Insurance Provider" name="insprovider_id" as="select">
              <option value="">— None —</option>
            </Field>
          </div>
        </Section>

        {/* Membership */}
        <Section title="Membership">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Membership Type" name="membership_type" />
            <Field label="Expiry Date" name="membership_expiry_date" type="date" />
            <Field label="Valid Till" name="valid_till" type="date" />
          </div>
        </Section>

        <div className="flex gap-3 pt-2">
          <Button type="submit">Save Patient</Button>
          <Button variant="secondary" type="reset">Clear</Button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  as,
  className,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "select";
  className?: string;
  children?: React.ReactNode;
}) {
  const base = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {as === "select" ? (
        <select name={name} className={base}>{children}</select>
      ) : (
        <input name={name} type={type} required={required} className={base} />
      )}
    </div>
  );
}
