import { mysqlTable, char, varchar, tinyint, datetime, decimal } from "drizzle-orm/mysql-core";

export const pharmasales = mysqlTable("pharmasales", {
  id: char("id", { length: 36 }).primaryKey(),
  patientId: char("patient_id", { length: 36 }),
  pharmasaleAmount: decimal("pharmasale_amount", { precision: 12, scale: 2 }),
  discount: decimal("discount", { precision: 10, scale: 2 }),
  netDiscount: decimal("net_discount", { precision: 10, scale: 2 }),
  finalAmount: decimal("final_amount", { precision: 12, scale: 2 }),
  receivedAmount: decimal("received_amount", { precision: 12, scale: 2 }),
  returnAmount: decimal("return_amount", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 25 }),
  isSettled: tinyint("is_settled").default(0),
  storeUpdated: tinyint("store_updated").default(0),
  recPayment: tinyint("rec_payment").default(0),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
});

export const pharmasaleitems = mysqlTable("pharmasaleitems", {
  id: char("id", { length: 36 }).primaryKey(),
  pharmasaleId: char("pharmasale_id", { length: 36 }),
  itemId: char("item_id", { length: 36 }),
  shelfId: char("shelf_id", { length: 36 }),
  qty: decimal("qty", { precision: 10, scale: 2 }),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  deleted: tinyint("deleted").default(0),
});

export const pharmashelfs = mysqlTable("pharmashelfs", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  rackId: char("rack_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
});

export const invbincards = mysqlTable("invbincards", {
  id: char("id", { length: 36 }).primaryKey(),
  itemId: char("item_id", { length: 36 }),
  shelfId: char("shelf_id", { length: 36 }),
  transactionType: varchar("transaction_type", { length: 30 }),
  qty: decimal("qty", { precision: 10, scale: 2 }),
  balanceQty: decimal("balance_qty", { precision: 10, scale: 2 }),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});
