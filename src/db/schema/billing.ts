import { mysqlTable, char, varchar, tinyint, datetime, decimal, text, bigint, double } from "drizzle-orm/mysql-core";

export const billings = mysqlTable("billings", {
  id: char("id", { length: 36 }).primaryKey(),
  payNumber: bigint("pay_number", { mode: "number" }),
  patientId: char("patient_id", { length: 36 }),
  totalAmount: double("total_amount"),
  discount: double("discount"),
  finalAmount: double("final_amount"),
  paymentStatus: varchar("payment_status", { length: 25 }),
  paymentDate: datetime("payment_date"),
  billParentId: char("bill_parent_id", { length: 36 }),
  billParentType: varchar("bill_parent_type", { length: 100 }),
  paysummaryId: char("paysummary_id", { length: 36 }),
  departmentId: char("department_id", { length: 36 }),
  printGenerated: tinyint("print_generated").default(0),
  discAuthorizedBy: varchar("disc_authorized_by", { length: 150 }),
  discRemarks: text("disc_remarks"),
  discountGivenId: char("discount_given_id", { length: 36 }),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const billdetails = mysqlTable("billdetails", {
  id: char("id", { length: 36 }).primaryKey(),
  billingId: char("billing_id", { length: 36 }),
  relatedModule: varchar("related_module", { length: 100 }),
  relatedId: char("related_id", { length: 36 }),
  units: decimal("units", { precision: 10, scale: 2 }),
  unitValue: decimal("unit_value", { precision: 12, scale: 2 }),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  taxtypeId: char("taxtype_id", { length: 36 }),
  tax: decimal("tax", { precision: 5, scale: 2 }),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }),
  deleted: tinyint("deleted").default(0),
});

export const payments = mysqlTable("payments", {
  id: char("id", { length: 36 }).primaryKey(),
  billParentId: char("bill_parent_id", { length: 36 }),
  paysummaryId: char("paysummary_id", { length: 36 }),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  paymentMode: varchar("payment_mode", { length: 30 }),
  walletTxnId: varchar("wallet_txn_id", { length: 100 }),
  walletOrderId: varchar("wallet_order_id", { length: 100 }),
  chequeNo: varchar("cheque_no", { length: 50 }),
  chequeDate: datetime("cheque_date"),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  dateEntered: datetime("date_entered"),
});

export const paysummarys = mysqlTable("paysummarys", {
  id: char("id", { length: 36 }).primaryKey(),
  patientId: char("patient_id", { length: 36 }),
  parentId: char("parent_id", { length: 36 }),
  parentType: varchar("parent_type", { length: 25 }),
  paysummaryNumber: bigint("paysummary_number", { mode: "number" }),
  paysummaryDate: datetime("paysummary_date"),
  printGenerated: tinyint("print_generated").default(0),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});
