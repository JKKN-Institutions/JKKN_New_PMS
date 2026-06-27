import { mysqlTable, char, varchar, tinyint, datetime, text, int, double, bigint } from "drizzle-orm/mysql-core";

export const casesheets = mysqlTable("casesheets", {
  id: char("id", { length: 36 }).primaryKey(),
  caseNumber: bigint("case_number", { mode: "number" }),
  patientId: char("patient_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  casesheetType: varchar("casesheet_type", { length: 25 }),
  treatmentType: varchar("treatment_type", { length: 25 }),
  status: varchar("status", { length: 25 }),
  isPrivate: tinyint("is_private").default(0),
  authorizeById: char("authorize_by_id", { length: 36 }),
  casesheetDate: datetime("casesheet_date"),
  closedDate: datetime("closed_date"),
  casesheetParentType: varchar("casesheet_parent_type", { length: 50 }),
  patientGroupId: char("patient_group_id", { length: 36 }),
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
  parentType: varchar("parent_type", { length: 25 }),
  patientId: char("patient_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  preproblemId: char("preproblem_id", { length: 36 }),
  description: text("description"),
  medicalhistoryDate: datetime("medicalhistory_date"),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
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
  parentType: varchar("parent_type", { length: 25 }),
  patientId: char("patient_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  treatmentlists: text("treatmentlists"),
  labsetups: text("labsetups"),
  exAmount: double("ex_amount"),
  description: text("description"),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const tooths = mysqlTable("tooths", {
  id: char("id", { length: 36 }).primaryKey(),
  patientId: char("patient_id", { length: 36 }),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 25 }),
  departmentId: char("department_id", { length: 36 }),
  toothNum: int("tooth_num"),
  toothRegion: int("tooth_region"),
  toothStatus: varchar("tooth_status", { length: 50 }),
  dentition: varchar("dentition", { length: 50 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const periodontalexaminations = mysqlTable("periodontalexaminations", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 25 }),
  patientId: char("patient_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  hygieneStatus: varchar("hygiene_status", { length: 25 }),
  bleedingOnProbing: varchar("bleeding_on_probing", { length: 150 }),
  toothMobility: varchar("tooth_mobility", { length: 255 }),
  furcation: varchar("furcation", { length: 255 }),
  recession: varchar("recession", { length: 30 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});
