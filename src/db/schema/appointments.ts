import { mysqlTable, char, varchar, tinyint, datetime, date, text, int, bigint } from "drizzle-orm/mysql-core";

export const appointments = mysqlTable("appointments", {
  id: char("id", { length: 36 }).primaryKey(),
  appNumber: bigint("app_number", { mode: "number" }),
  parentId: char("parent_id", { length: 36 }),        // patient id
  parentType: varchar("parent_type", { length: 25 }),
  departmentId: char("department_id", { length: 36 }),
  dateStart: datetime("date_start"),
  dateEnd: datetime("date_end"),
  status: varchar("status", { length: 25 }),
  isEmergency: tinyint("is_emergency").default(0),
  isNew: tinyint("is_new").default(0),
  staffId: char("staff_id", { length: 36 }),
  ugId: char("ug_id", { length: 36 }),
  pgId: char("pg_id", { length: 36 }),
  ugcasesheetId: char("ugcasesheet_id", { length: 36 }),
  pgcasesheetId: char("pgcasesheet_id", { length: 36 }),
  reasonVisit: text("resaon_visit"),
  followupType: varchar("followup_type", { length: 50 }),
  tokenNo: varchar("token_no", { length: 50 }),
  operatedById: char("operated_by_id", { length: 36 }),
  assistedById: char("assisted_by_id", { length: 36 }),
  observedById: char("observed_by_id", { length: 36 }),
  hygienistId: char("hygienist_id", { length: 36 }),
  opdManagerId: char("opdmanager_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  modifiedUserId: char("modified_user_id", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const departmentvisits = mysqlTable("departmentvisits", {
  id: char("id", { length: 36 }).primaryKey(),
  patientId: char("patient_id", { length: 36 }),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 25 }),
  departmentId: char("department_id", { length: 36 }),
  visitDate: datetime("visit_date"),
  nextAppointmentId: char("next_appointment_id", { length: 36 }),
  seqNo: int("seq_no"),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const chairtokens = mysqlTable("chairtokens", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 40 }),
  departmentId: char("department_id", { length: 36 }),
  chairId: char("chair_id", { length: 36 }),
  tokenNo: varchar("token_no", { length: 30 }),
  tokenSerial: int("token_serial"),
  tokenDate: date("token_date"),
  status: varchar("status", { length: 20 }),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const callpatientdetails = mysqlTable("callpatientdetails", {
  id: char("id", { length: 36 }).primaryKey(),
  patientId: char("patient_id", { length: 36 }),
  callpolicyId: char("callpolicy_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  callDate: date("call_date"),
  communication: text("communication"),
  status: varchar("status", { length: 50 }),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});
