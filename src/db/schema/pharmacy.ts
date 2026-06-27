import { mysqlTable, char, varchar, tinyint, datetime, date, double, bigint } from "drizzle-orm/mysql-core";

export const pharmasales = mysqlTable("pharmasales", {
  id: char("id", { length: 36 }).primaryKey(),
  patientId: char("patient_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  pharmasaleNumber: bigint("pharmasale_number", { mode: "number" }),
  pharmasaleDate: datetime("pharmasale_date"),
  pharmasaleStatus: varchar("pharmasale_status", { length: 25 }),
  pharmasaleAmount: double("pharmasale_amount"),
  discount: double("discount"),
  netDiscount: double("net_discount"),
  finalAmount: double("final_amount"),
  receivedAmount: double("received_amount"),
  returnAmount: double("return_amount"),
  isSettled: tinyint("is_settled").default(0),
  storeUpdated: tinyint("store_updated").default(0),
  recPayment: tinyint("rec_payment").default(0),
  printGenerated: tinyint("print_generated").default(0),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const pharmasaleitems = mysqlTable("pharmasaleitems", {
  id: char("id", { length: 36 }).primaryKey(),
  pharmasaleId: char("pharmasale_id", { length: 36 }),
  itemId: char("item_id", { length: 36 }),
  inventorystoreId: char("inventorystore_id", { length: 36 }),
  quantity: double("quantity"),
  returnQuantity: double("return_quantity"),
  pharmasaleValue: double("pharmasale_value"),
  pharmasaleMrp: double("pharmasale_mrp"),
  lineTotal: double("line_total"),
  discount: double("discount"),
  tax: double("tax"),
  expiryDate: date("expiry_date"),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const pharmaracks = mysqlTable("pharmaracks", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const pharmashelfs = mysqlTable("pharmashelfs", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  rackId: char("rack_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});

export const items = mysqlTable("items", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 150 }),
  itemCode: varchar("item_code", { length: 15 }),
  itemcategoryId: char("itemcategory_id", { length: 36 }),
  itemgroupId: char("itemgroup_id", { length: 36 }),
  measuringUnit: varchar("measuring_unit", { length: 25 }),
  warnQty: varchar("warn_qty", { length: 25 }),
  itemBill: tinyint("item_bill").default(0),
  itemConsum: tinyint("item_consum").default(0),
  isSaleable: tinyint("is_saleable").default(0),
  status: varchar("status", { length: 10 }),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});

export const invbincards = mysqlTable("invbincards", {
  id: char("id", { length: 36 }).primaryKey(),
  itemId: char("item_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  storeId: char("store_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 100 }),
  parentId: char("parent_id", { length: 36 }),
  transactionDate: datetime("transaction_date"),
  transactionNumber: bigint("transaction_number", { mode: "number" }),
  startingQty: double("starting_qty"),
  closingQty: double("closing_qty"),
  issueQty: double("issue_qty"),
  receiveQty: double("receive_qty"),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});
