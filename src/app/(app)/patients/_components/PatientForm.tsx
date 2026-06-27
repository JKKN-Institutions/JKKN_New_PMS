"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

type Lookup = { id: string; name: string | null };

interface PatientFormProps {
  action: (prev: string | null, fd: FormData) => Promise<string | null>;
  defaults?: Partial<PatientDefaults>;
  groups: Lookup[];
  categories: Lookup[];
  occupations: Lookup[];
  insproviders: Lookup[];
  referrals: Lookup[];
}

export interface PatientDefaults {
  salutation: string;
  first_name: string;
  last_name: string;
  name_tamil: string;
  sex: string;
  birthdate: string;
  blood_grp: string;
  father_name: string;
  phone_mobile: string;
  phone_home: string;
  phone_work: string;
  email_address: string;
  street: string;
  postalcode: string;
  patient_group_id: string;
  patientcategory_id: string;
  occupationlist_id: string;
  vip_patient: boolean;
  refral_id: string;
  insprovider_id: string;
  membership_type: string;
  membership_expiry_date: string;
  valid_till: string;
}

export default function PatientForm({
  action,
  defaults = {},
  groups,
  categories,
  occupations,
  insproviders,
  referrals,
}: PatientFormProps) {
  const [error, formAction] = useFormState(action, null);

  return (
    <form action={formAction} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Identity */}
      <Section title="Identity">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Salutation" name="salutation" as="select" defaultValue={defaults.salutation}>
            <option value="">—</option>
            {["Mr.", "Mrs.", "Ms.", "Dr.", "Master", "Baby"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Field>
          <Field label="First Name *" name="first_name" required defaultValue={defaults.first_name} />
          <Field label="Last Name" name="last_name" defaultValue={defaults.last_name} />
          <Field label="Sex" name="sex" as="select" defaultValue={defaults.sex}>
            <option value="">—</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Field>
          <Field label="Date of Birth" name="birthdate" type="date" defaultValue={defaults.birthdate} />
          <Field label="Blood Group" name="blood_grp" as="select" defaultValue={defaults.blood_grp}>
            {["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
              <option key={g} value={g}>{g || "—"}</option>
            ))}
          </Field>
          <Field label="Father's Name" name="father_name" className="md:col-span-2" defaultValue={defaults.father_name} />
          <Field label="Name (Tamil)" name="name_tamil" className="md:col-span-2" defaultValue={defaults.name_tamil} />
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Mobile (Primary) *" name="phone_mobile" type="tel" required defaultValue={defaults.phone_mobile} />
          <Field label="Phone (Home)" name="phone_home" type="tel" defaultValue={defaults.phone_home} />
          <Field label="Phone (Work)" name="phone_work" type="tel" defaultValue={defaults.phone_work} />
          <Field label="Email" name="email_address" type="email" className="md:col-span-2" defaultValue={defaults.email_address} />
        </div>
      </Section>

      {/* Address */}
      <Section title="Address">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Street" name="street" className="md:col-span-2" defaultValue={defaults.street} />
          <Field label="Postal Code" name="postalcode" defaultValue={defaults.postalcode} />
        </div>
      </Section>

      {/* Classification */}
      <Section title="Classification">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Patient Group" name="patient_group_id" as="select" defaultValue={defaults.patient_group_id}>
            <option value="">— Select —</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </Field>
          <Field label="Patient Category" name="patientcategory_id" as="select" defaultValue={defaults.patientcategory_id}>
            <option value="">— Select —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Field>
          <Field label="Occupation" name="occupationlist_id" as="select" defaultValue={defaults.occupationlist_id}>
            <option value="">— Select —</option>
            {occupations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </Field>
          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="vip_patient"
                defaultChecked={defaults.vip_patient}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              VIP Patient
            </label>
          </div>
        </div>
      </Section>

      {/* Referral & Insurance */}
      <Section title="Referral & Insurance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Referred By" name="refral_id" as="select" defaultValue={defaults.refral_id}>
            <option value="">— None —</option>
            {referrals.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Field>
          <Field label="Insurance Provider" name="insprovider_id" as="select" defaultValue={defaults.insprovider_id}>
            <option value="">— None —</option>
            {insproviders.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </Field>
        </div>
      </Section>

      {/* Membership */}
      <Section title="Membership">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Membership Type" name="membership_type" defaultValue={defaults.membership_type} />
          <Field label="Expiry Date" name="membership_expiry_date" type="date" defaultValue={defaults.membership_expiry_date} />
          <Field label="Valid Till" name="valid_till" type="date" defaultValue={defaults.valid_till} />
        </div>
      </Section>

      <div className="flex gap-3 pt-2">
        <SubmitButton />
        <Button variant="secondary" type="reset">Clear</Button>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save Patient"}
    </Button>
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
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "select";
  className?: string;
  defaultValue?: string;
  children?: React.ReactNode;
}) {
  const base =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {as === "select" ? (
        <select name={name} defaultValue={defaultValue ?? ""} className={base}>
          {children}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue ?? ""}
          className={base}
        />
      )}
    </div>
  );
}
