import Image from "next/image";
import { cn } from "@/lib/cn";
import { calcAge, fmtCurrency, fullName } from "@/lib/formatters";

export interface PatientBannerData {
  id: string;
  patNumber: string | null;
  salutation?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  sex?: string | null;
  birthdate?: Date | string | null;
  bloodGrp?: string | null;
  phoneMobile?: string | null;
  outstandingAmt?: number | string | null;
  membershipType?: string | null;
  membershipExpiryDate?: Date | string | null;
  vipPatient?: number | null;
  allergies?: string[];
  photoUrl?: string | null;
}

interface PatientBannerProps {
  patient: PatientBannerData;
  className?: string;
}

export function PatientBanner({ patient, className }: PatientBannerProps) {
  const name = fullName(patient);
  const outstanding = Number(patient.outstandingAmt ?? 0);

  return (
    <div className={cn("bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm", className)}>
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
        {patient.photoUrl ? (
          <Image src={patient.photoUrl} alt={name} width={48} height={48} className="w-full h-full rounded-full object-cover" />
        ) : (
          (patient.firstName?.[0] ?? "P").toUpperCase()
        )}
      </div>

      {/* Core info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 truncate">{name}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{patient.patNumber}</span>
          {patient.vipPatient ? (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">VIP</span>
          ) : null}
          {patient.membershipType ? (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{patient.membershipType}</span>
          ) : null}
        </div>
        <div className="text-xs text-gray-500 mt-0.5 flex gap-3 flex-wrap">
          {patient.sex && <span>{patient.sex}</span>}
          {patient.birthdate && <span>{calcAge(patient.birthdate)}</span>}
          {patient.bloodGrp && <span className="font-medium text-red-600">{patient.bloodGrp}</span>}
          {patient.phoneMobile && <span>{patient.phoneMobile}</span>}
        </div>
        {patient.allergies && patient.allergies.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {patient.allergies.map((a) => (
              <span key={a} className="text-xs bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">
                ⚠ {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Outstanding balance */}
      {outstanding !== 0 && (
        <div className={cn("text-right shrink-0", outstanding > 0 ? "text-red-600" : "text-green-600")}>
          <p className="text-xs text-gray-500">Outstanding</p>
          <p className="font-semibold text-sm">{fmtCurrency(outstanding)}</p>
        </div>
      )}
    </div>
  );
}
