import { mysqlTable, char, varchar, tinyint, datetime, text, int, bigint } from "drizzle-orm/mysql-core";

export const labrequests = mysqlTable("labrequests", {
  id: char("id", { length: 36 }).primaryKey(),
  patientId: char("patient_id", { length: 36 }),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  casesheetId: char("casesheet_id", { length: 36 }),
  testId: char("test_id", { length: 36 }),
  labsetupgroupId: char("labsetupgroup_id", { length: 36 }),
  categoryId: char("category_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  diagnosis: varchar("diagnosis", { length: 255 }),
  noOfUnit: int("no_of_unit"),
  sampleName: text("sample_name"),
  labUserId: char("lab_user_id", { length: 36 }),
  doneById: char("done_by_id", { length: 36 }),
  reportedById: char("reported_by_id", { length: 36 }),
  labRequestStatus: varchar("labrequest_status", { length: 25 }),
  requestDate: datetime("request_date"),
  sampleDate: datetime("sample_date"),
  confirmDate: datetime("confirm_date"),
  doneDate: datetime("done_date"),
  expDoneDate: datetime("exp_done_date"),
  labNumber: bigint("lab_number", { mode: "number" }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const labreports = mysqlTable("labreports", {
  id: char("id", { length: 36 }).primaryKey(),
  requestId: char("request_id", { length: 36 }),
  testId: char("test_id", { length: 36 }),
  patientId: char("patient_id", { length: 36 }),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 25 }),
  departmentId: char("department_id", { length: 36 }),
  casesheetId: char("casesheet_id", { length: 36 }),
  reportDate: datetime("report_date"),
  reportType: varchar("report_type", { length: 25 }),
  reportValue: text("report_value"),
  reportCriteria: varchar("report_criteria", { length: 100 }),
  fileExtension: char("file_extension", { length: 10 }),
  status: varchar("status", { length: 50 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const labreportuploads = mysqlTable("labreportuploads", {
  id: char("id", { length: 36 }).primaryKey(),
  labrequestId: char("labrequest_id", { length: 36 }),
  testId: char("test_id", { length: 36 }),
  patientId: char("patient_id", { length: 36 }),
  fileName: varchar("file_name", { length: 255 }),
  fileExtension: char("file_extension", { length: 10 }),
  fileMimeType: varchar("file_mime_type", { length: 100 }),
  uploadDate: datetime("upload_date"),
  printInReport: tinyint("print_in_report").default(0),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const labsetupgroups = mysqlTable("labsetupgroups", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const labsetups = mysqlTable("labsetups", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  labsetupgroupId: char("labsetupgroup_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});
