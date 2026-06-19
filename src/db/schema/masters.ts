import { mysqlTable, char, varchar, tinyint, decimal, int } from "drizzle-orm/mysql-core";

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

export const diagnosislists = mysqlTable("diagnosislists", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  diagnosisgroupId: char("diagnosisgroup_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});

export const complaintlists = mysqlTable("complaintlists", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const billabletreatments = mysqlTable("billabletreatments", {
  id: char("id", { length: 36 }).primaryKey(),
  treatmentlistId: char("treatmentlist_id", { length: 36 }),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const billabletreatmentcharges = mysqlTable("billabletreatmentcharges", {
  id: char("id", { length: 36 }).primaryKey(),
  billabletreatmentId: char("billabletreatment_id", { length: 36 }),
  patientcategoryId: char("patientcategory_id", { length: 36 }),
  unitCharge: decimal("unit_charge", { precision: 12, scale: 2 }),
  deleted: tinyint("deleted").default(0),
});

export const taxtypes = mysqlTable("taxtypes", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 100 }),
  taxPercent: decimal("tax_percent", { precision: 5, scale: 2 }),
  deleted: tinyint("deleted").default(0),
});

export const sequences = mysqlTable("sequences", {
  id: char("id", { length: 36 }).primaryKey(),
  moduleName: varchar("module_name", { length: 100 }),
  prefix: varchar("prefix", { length: 20 }),
  suffix: varchar("suffix", { length: 20 }),
  currentValue: int("current_value"),
  padding: int("padding"),
  deleted: tinyint("deleted").default(0),
});
