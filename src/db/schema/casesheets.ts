import { mysqlTable, char, varchar, tinyint, datetime, text, int } from "drizzle-orm/mysql-core";

export const casesheets = mysqlTable("casesheets", {
  id: char("id", { length: 36 }).primaryKey(),
  caseNumber: varchar("case_number", { length: 30 }),
  patientId: char("patient_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  casesheetType: varchar("casesheet_type", { length: 50 }),
  treatmentType: varchar("treatment_type", { length: 50 }),
  status: varchar("status", { length: 25 }),
  ugId: char("ug_id", { length: 36 }),
  pgId: char("pg_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  modifiedUserId: char("modified_user_id", { length: 36 }),
  assignedUserId: char("assigned_user_id", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const complaints = mysqlTable("complaints", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  complaintlistId: char("complaintlist_id", { length: 36 }),
  toothNo: varchar("tooth_no", { length: 20 }),
  description: text("description"),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
});

export const medicalhistorys = mysqlTable("medicalhistorys", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  preproblemId: char("preproblem_id", { length: 36 }),
  description: text("description"),
  isAllergy: tinyint("is_allergy").default(0),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const provisionaldiagnoss = mysqlTable("provisionaldiagnoss", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  diagnosisgroupId: char("diagnosisgroup_id", { length: 36 }),
  diagnosislistId: char("diagnosislist_id", { length: 36 }),
  diagnosissub1Id: char("diagnosissub1_id", { length: 36 }),
  diagnosissub2Id: char("diagnosissub2_id", { length: 36 }),
  toothNo: varchar("tooth_no", { length: 20 }),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const diagnosiss = mysqlTable("diagnosiss", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  diagnosisgroupId: char("diagnosisgroup_id", { length: 36 }),
  diagnosislistId: char("diagnosislist_id", { length: 36 }),
  diagnosissub1Id: char("diagnosissub1_id", { length: 36 }),
  diagnosissub2Id: char("diagnosissub2_id", { length: 36 }),
  toothNo: varchar("tooth_no", { length: 20 }),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const treatmentadvices = mysqlTable("treatmentadvices", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  treatmentlistId: char("treatmentlist_id", { length: 36 }),
  toothNo: varchar("tooth_no", { length: 20 }),
  description: text("description"),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const tooths = mysqlTable("tooths", {
  id: char("id", { length: 36 }).primaryKey(),
  patientId: char("patient_id", { length: 36 }),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  toothNo: varchar("tooth_no", { length: 20 }),
  condition: varchar("condition", { length: 100 }),
  surface: varchar("surface", { length: 50 }),
  notes: text("notes"),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const periodontalexaminations = mysqlTable("periodontalexaminations", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  toothNo: varchar("tooth_no", { length: 20 }),
  pocketDepth: int("pocket_depth"),
  bleedingOnProbing: tinyint("bleeding_on_probing").default(0),
  mobility: int("mobility"),
  deleted: tinyint("deleted").default(0),
});
