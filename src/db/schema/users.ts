import { mysqlTable, char, varchar, tinyint, datetime, date, text } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: char("id", { length: 36 }).primaryKey(),
  userName: varchar("user_name", { length: 60 }),
  userHash: varchar("user_hash", { length: 32 }),
  salutation: varchar("salutation", { length: 5 }),
  firstName: varchar("first_name", { length: 30 }),
  lastName: varchar("last_name", { length: 30 }),
  isAdmin: tinyint("is_admin").default(0),
  title: varchar("title", { length: 50 }),
  departmentId: char("department_id", { length: 36 }),
  subdepartmentId: char("subdepartment_id", { length: 36 }),
  phoneMobile: varchar("phone_mobile", { length: 50 }),
  phoneWork: varchar("phone_work", { length: 50 }),
  emailAddress: varchar("email_address", { length: 255 }),
  status: varchar("status", { length: 25 }),
  employeeStatus: varchar("employee_status", { length: 25 }),
  empCode: varchar("emp_code", { length: 15 }),
  joiningDate: date("joining_date"),
  userCategoryId: char("user_category_id", { length: 36 }),
  empgroupId: char("empgroup_id", { length: 36 }),
  qualification: varchar("qualification", { length: 255 }),
  specialization: varchar("specialization", { length: 255 }),
  bloodGrp: varchar("blood_grp", { length: 25 }),
  isPresent: tinyint("is_present").default(0),
  deleted: tinyint("deleted").default(0),
  createdBy: char("created_by", { length: 36 }),
  modifiedUserId: char("modified_user_id", { length: 36 }),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});

export const loginUsers = mysqlTable("login_users", {
  id: char("id", { length: 36 }).primaryKey(),
  userId: char("user_id", { length: 36 }),
  loggedIn: tinyint("logged_in").default(0),
  lastLogin: datetime("last_login"),
  sessionId: varchar("session_id", { length: 36 }),
  remoteAddress: varchar("remote_address", { length: 100 }),
  deleted: tinyint("deleted").default(0),
});

export const usertypes = mysqlTable("usertypes", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  deleted: tinyint("deleted").default(0),
});

export const aclRolesActions = mysqlTable("acl_roles_actions", {
  id: char("id", { length: 36 }).primaryKey(),
  roleId: char("role_id", { length: 36 }),
  actionId: char("action_id", { length: 36 }),
  accessOverride: tinyint("access_override"),
  deleted: tinyint("deleted").default(0),
});

export const aclActions = mysqlTable("acl_actions", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 150 }),
  category: varchar("category", { length: 100 }),
  aclType: varchar("acltype", { length: 100 }),
  deleted: tinyint("deleted").default(0),
});

export const departments = mysqlTable("departments", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 150 }),
  departmentStatus: varchar("department_status", { length: 25 }),
  departmentType: varchar("department_type", { length: 50 }),
  deleted: tinyint("deleted").default(0),
});

export const userPreferences = mysqlTable("user_preferences", {
  id: char("id", { length: 36 }).primaryKey(),
  assignedUserId: char("assigned_user_id", { length: 36 }),
  category: varchar("category", { length: 50 }),
  value: text("contents"),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
});
