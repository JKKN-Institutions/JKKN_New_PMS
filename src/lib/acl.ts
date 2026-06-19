"use server";

export type AclModule =
  | "Patients"
  | "Appointments"
  | "Casesheets"
  | "Treatments"
  | "Prescriptions"
  | "Labrequests"
  | "Pharmacy"
  | "Billings"
  | "Users"
  | "Admin"
  | "Reports"
  | "Approvals";

export type AclAction = "list" | "view" | "create" | "edit" | "delete";

// Replace with a real DB-backed ACL check against acl_roles_actions + login_users session.
// This stub allows all actions so the UI renders during development.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkAccess(_module: AclModule, _action: AclAction, _userId?: string): Promise<boolean> {
  return true;
}

export function useAcl() {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    can: (_module: AclModule, _action: AclAction) => true,
  };
}
