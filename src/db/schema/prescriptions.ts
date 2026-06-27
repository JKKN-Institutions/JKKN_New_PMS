import { mysqlTable, char, varchar, tinyint, datetime } from "drizzle-orm/mysql-core";

export const prescriptions = mysqlTable("prescriptions", {
  id: char("id", { length: 36 }).primaryKey(),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  brandId: char("brand_id", { length: 36 }),
  visitId: char("visit_id", { length: 36 }),
  staffId: char("staff_id", { length: 36 }),
  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  duration: varchar("duration", { length: 100 }),
  appType: varchar("app_type", { length: 50 }),
  preClass: varchar("pre_class", { length: 50 }),
  status: varchar("status", { length: 25 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const prescriptionbrands = mysqlTable("prescriptionbrands", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  prescriptionlistId: char("prescriptionlist_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});

export const prescriptionlists = mysqlTable("prescriptionlists", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});
