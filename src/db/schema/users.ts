import { mysqlTable, char, varchar, tinyint, datetime, int } from "drizzle-orm/mysql-core";

export const loginUsers = mysqlTable("login_users", {
  id: char("id", { length: 36 }).primaryKey(),
  userType: varchar("user_type", { length: 36 }),
  userName: varchar("user_name", { length: 60 }),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  departmentId: char("department_id", { length: 36 }),
  status: varchar("status", { length: 25 }),
  deleted: tinyint("deleted").default(0),
  dateEntered: datetime("date_entered"),
  dateModified: datetime("date_modified"),
  createdBy: char("created_by", { length: 36 }),
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
  allowDefault: int("allow_default"),
  deleted: tinyint("deleted").default(0),
});

export const departments = mysqlTable("departments", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  shortName: varchar("short_name", { length: 50 }),
  deleted: tinyint("deleted").default(0),
});

export const userPreferences = mysqlTable("user_preferences", {
  id: char("id", { length: 36 }).primaryKey(),
  userId: char("user_id", { length: 36 }),
  category: varchar("category", { length: 50 }),
  name: varchar("name", { length: 255 }),
  value: varchar("value", { length: 5000 }),
  deleted: tinyint("deleted").default(0),
});
