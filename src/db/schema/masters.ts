import { mysqlTable, char, varchar, tinyint, datetime, date, double } from "drizzle-orm/mysql-core";

export const patientgroups = mysqlTable("patientgroups", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const patientcategorys = mysqlTable("patientcategorys", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const insproviders = mysqlTable("insproviders", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const occupationlists = mysqlTable("occupationlists", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const diagnosisgroups = mysqlTable("diagnosisgroups", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const diagnosislists = mysqlTable("diagnosislists", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  diagnosisgroupId: char("diagnosisgroup_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});

// Actual DB table name is "preproblems" (not "preproblemlist")
export const preproblems = mysqlTable("preproblems", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  status: varchar("status", { length: 50 }),
  deleted: tinyint("deleted").default(0),
});

export const complaintlists = mysqlTable("complaintlists", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const billabletreatments = mysqlTable("billabletreatments", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 50 }),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 25 }),
  billabletreatmentsetupId: char("billabletreatmentsetup_id", { length: 36 }),
  patientId: char("patient_id", { length: 36 }),
  departmentId: varchar("department_id", { length: 255 }),
  units: tinyint("units"),
  status: varchar("status", { length: 25 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const billabletreatmentcharges = mysqlTable("billabletreatmentcharges", {
  id: char("id", { length: 36 }).primaryKey(),
  billabletreatmentsetupId: char("billabletreatmentsetup_id", { length: 36 }),
  effectiveDate: date("effective_date"),
  amount: double("amount"),
  unitValue: double("unit_value"),
  taxtypeId: char("taxtype_id", { length: 36 }),
  insprovIderId: char("insprovider_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});

export const taxtypes = mysqlTable("taxtypes", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 150 }),
  tax: double("tax"),
  status: varchar("status", { length: 50 }),
  deleted: tinyint("deleted").default(0),
});

export const refrals = mysqlTable("refrals", {
  id: char("id", { length: 36 }).primaryKey(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  deleted: tinyint("deleted").default(0),
});

export const sequences = mysqlTable("sequences", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  sequenceType: char("sequence_type", { length: 25 }),
  period: tinyint("period"),
  seqNo: tinyint("seq_no"),
  deleted: tinyint("deleted").default(0),
});
