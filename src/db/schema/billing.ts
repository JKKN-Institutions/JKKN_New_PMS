import { mysqlTable, char, varchar, tinyint, datetime, decimal, text } from "drizzle-orm/mysql-core";

export const billings = mysqlTable("billings", {
  id: char("id", { length: 36 }).primaryKey(),
  billNumber: varchar("bill_number", { length: 30 }),
  billParentId: char("bill_parent_id", { length: 36 }),
  billParentType: varchar("bill_parent_type", { length: 100 }),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }),
  netAmount: decimal("net_amount", { precision: 12, scale: 2 }),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }),
  balanceAmount: decimal("balance_amount", { precision: 12, scale: 2 }),
  paymentStatus: varchar("payment_status", { length: 25 }),
  discAuthorizedBy: char("disc_authorized_by", { length: 36 }),
  discountGivenId: char("discount_given_id", { length: 36 }),
  discRemarks: text("disc_remarks"),
  printGenerated: tinyint("print_generated").default(0),
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
  totalPaid: decimal("total_paid", { precision: 12, scale: 2 }),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
});
