import { mysqlTable, char, varchar, tinyint, datetime, date, decimal, int, text } from "drizzle-orm/mysql-core";

export const treatments = mysqlTable("treatments", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  treatmentlistId: char("treatmentlist_id", { length: 36 }),
  toothNo: varchar("tooth_no", { length: 20 }),
  treatingDoctor: char("treating_doctor", { length: 36 }),
  diagnosisDoctor: char("diagnosis_doctor", { length: 36 }),
  isBillable: tinyint("is_billable").default(1),
  isMajor: tinyint("is_major").default(0),
  units: decimal("units", { precision: 10, scale: 2 }),
  treatmentType: varchar("treatment_type", { length: 50 }),
  treatmentStartdate: date("treatment_startdate"),
  treatmentEnddate: date("treatment_enddate"),
  treatmentValidDays: int("treatment_valid_days"),
  primaryTreatmentId: char("primary_treatment_id", { length: 36 }),
  status: varchar("status", { length: 25 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const worksteps = mysqlTable("worksteps", {
  id: char("id", { length: 36 }).primaryKey(),
  treatmentId: char("treatment_id", { length: 36 }),
  appointmentId: char("appointment_id", { length: 36 }),
  worksteplistId: char("worksteplist_id", { length: 36 }),
  status: varchar("status", { length: 25 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
});

export const approveworksteps = mysqlTable("approveworksteps", {
  id: char("id", { length: 36 }).primaryKey(),
  workstepId: char("workstep_id", { length: 36 }),
  requestedById: char("requested_by_id", { length: 36 }),
  approvedById: char("approved_by_id", { length: 36 }),
  casesheetId: char("casesheet_id", { length: 36 }),
  status: varchar("status", { length: 25 }),
  remark: text("remark"),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const treatmentlists = mysqlTable("treatmentlists", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  treatmentgroupId: char("treatmentgroup_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});
