import { mysqlTable, char, varchar, tinyint, datetime, text, int } from "drizzle-orm/mysql-core";

export const appointments = mysqlTable("appointments", {
  id: char("id", { length: 36 }).primaryKey(),
  patientId: char("patient_id", { length: 36 }),
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
  tokenNo: int("token_no"),
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
  appointmentId: char("appointment_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  nextAppointmentId: char("next_appointment_id", { length: 36 }),
  seqNo: int("seq_no"),
  deleted: tinyint("deleted").default(0),
});

export const chairtokens = mysqlTable("chairtokens", {
  id: char("id", { length: 36 }).primaryKey(),
  appointmentId: char("appointment_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  tokenNo: int("token_no"),
  status: varchar("status", { length: 25 }),
  deleted: tinyint("deleted").default(0),
});

export const callpatientdetails = mysqlTable("callpatientdetails", {
  id: char("id", { length: 36 }).primaryKey(),
  appointmentId: char("appointment_id", { length: 36 }),
  calledAt: datetime("called_at"),
  calledBy: char("called_by", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});
