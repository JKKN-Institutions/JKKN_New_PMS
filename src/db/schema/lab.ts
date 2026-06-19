import { mysqlTable, char, varchar, tinyint, datetime, text, int } from "drizzle-orm/mysql-core";

export const labrequests = mysqlTable("labrequests", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  casesheetId: char("casesheet_id", { length: 36 }),
  testId: char("test_id", { length: 36 }),
  labsetupgroupId: char("labsetupgroup_id", { length: 36 }),
  categoryId: char("category_id", { length: 36 }),
  diagnosis: text("diagnosis"),
  noOfUnit: int("no_of_unit"),
  sampleName: varchar("sample_name", { length: 255 }),
  labUserId: char("lab_user_id", { length: 36 }),
  doneById: char("done_by_id", { length: 36 }),
  reportedById: char("reported_by_id", { length: 36 }),
  status: varchar("status", { length: 25 }),
  requestDate: datetime("request_date"),
  sampleDate: datetime("sample_date"),
  confirmDate: datetime("confirm_date"),
  doneDate: datetime("done_date"),
  expDoneDate: datetime("exp_done_date"),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const labreports = mysqlTable("labreports", {
  id: char("id", { length: 36 }).primaryKey(),
  labrequestId: char("labrequest_id", { length: 36 }),
  result: text("result"),
  remarks: text("remarks"),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const labreportuploads = mysqlTable("labreportuploads", {
  id: char("id", { length: 36 }).primaryKey(),
  labrequestId: char("labrequest_id", { length: 36 }),
  fileUrl: varchar("file_url", { length: 500 }),
  fileName: varchar("file_name", { length: 255 }),
  imageUploaded: tinyint("image_uploaded").default(0),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const labsetups = mysqlTable("labsetups", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  labsetupgroupId: char("labsetupgroup_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});
