export type ParentType =
  | "Patients"
  | "Casesheets"
  | "Appointments"
  | "Labrequests"
  | "Treatments"
  | "Insproviders";

export interface ParentRef {
  type: ParentType;
  id: string;
}

export function resolveParentHref(ref: ParentRef): string {
  switch (ref.type) {
    case "Patients":
      return `/patients/${ref.id}`;
    case "Casesheets":
      return `/casesheets/${ref.id}`;
    case "Appointments":
      return `/appointments/${ref.id}`;
    case "Labrequests":
      return `/lab/requests/${ref.id}`;
    case "Treatments":
      return `/casesheets/${ref.id}/treatments`;
    case "Insproviders":
      return `/admin/insproviders/${ref.id}`;
    default:
      return "/";
  }
}
