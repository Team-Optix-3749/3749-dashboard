import { pgEnum, pgSchema, pgTable, text, uuid, boolean, integer, timestamp, doublePrecision, uniqueIndex } from "drizzle-orm/pg-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

const authSchema = pgSchema("auth");

export const authUsers = authSchema.table("users", {
	id: uuid("id").primaryKey(),
});

export const userRoleEnum = pgEnum("user_role", [
	"OWNER",
	"OFFICER",
	"LEADERSHIP",
	"MEMBER",
	"PENDING",
]);

export const specialPermEnum = pgEnum("special_perm", [
	"OPI_PERMS",
	"BUILD_PERMS",
	"OUTREACH_PERMS",
]);

export const opiCategoryEnum = pgEnum("opi_category", [
	"Outreach",
	"Community Service",
	"STEM Education",
	"Fundraising",
	"Team Building",
	"Competition Prep",
	"Other",
]);

export const opiStatusEnum = pgEnum("opi_status", [
	"PENDING",
	"IN_REVIEW",
	"APPROVED",
	"EXECUTED",
	"REJECTED",
]);

export const opiEventMemberRoleEnum = pgEnum("opi_event_member_role", [
	"PLANNER",
	"ATTENDEE",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
	"OPI_STATUS",
	"MEMBER_VERIFIED",
	"BUILD_AUTO_ENDED",
	"PENDING_MEMBER",
]);

export const users = pgTable("users", {
	id: uuid("id")
		.primaryKey()
		.references(() => authUsers.id, { onDelete: "cascade" }),
	role: userRoleEnum("role").notNull().default("MEMBER"),
	isVerified: boolean("is_verified").notNull().default(true),
	grade: integer("grade"),
	subteam: text("subteam"),
	phone: text("phone"),
	bio: text("bio"),
	joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const specialPerms = pgTable(
	"special_perms",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		permType: specialPermEnum("perm_type").notNull(),
		grantedBy: uuid("granted_by").references(() => users.id, { onDelete: "set null" }),
		grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [uniqueIndex("special_perms_user_perm_unique").on(table.userId, table.permType)],
);

export const buildSessions = pgTable("build_sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true }),
	durationMinutes: integer("duration_minutes"),
	isActive: boolean("is_active").notNull().default(true),
	autoEnded: boolean("auto_ended").notNull().default(false),
});

export const buildZones = pgTable("build_zones", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	latitude: doublePrecision("latitude"),
	longitude: doublePrecision("longitude"),
	radiusMeters: integer("radius_meters"),
	isActive: boolean("is_active").notNull().default(true),
});

export const outreachEvents = pgTable("outreach_events", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	date: timestamp("date", { withTimezone: true }).notNull(),
	location: text("location"),
	createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const outreachAttendance = pgTable(
	"outreach_attendance",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		eventId: uuid("event_id")
			.notNull()
			.references(() => outreachEvents.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		minutesLogged: integer("minutes_logged").notNull(),
		loggedBy: uuid("logged_by").references(() => users.id, { onDelete: "set null" }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [uniqueIndex("outreach_attendance_event_user_unique").on(table.eventId, table.userId)],
);

export const opiSubmissions = pgTable("opi_submissions", {
	id: uuid("id").primaryKey().defaultRandom(),
	submitterId: uuid("submitter_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description").notNull(),
	category: opiCategoryEnum("category").notNull(),
	proposedDate: timestamp("proposed_date", { withTimezone: true }).notNull(),
	status: opiStatusEnum("status").notNull().default("PENDING"),
	reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
	reviewNote: text("review_note"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const opiEvents = pgTable("opi_events", {
	id: uuid("id").primaryKey().defaultRandom(),
	submissionId: uuid("submission_id").references(() => opiSubmissions.id, { onDelete: "set null" }),
	name: text("name").notNull(),
	date: timestamp("date", { withTimezone: true }).notNull(),
	location: text("location"),
	createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const opiEventMembers = pgTable(
	"opi_event_members",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		eventId: uuid("event_id")
			.notNull()
			.references(() => opiEvents.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: opiEventMemberRoleEnum("role").notNull().default("ATTENDEE"),
		minutesLogged: integer("minutes_logged"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [uniqueIndex("opi_event_member_event_user_unique").on(table.eventId, table.userId)],
);

export const notifications = pgTable("notifications", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	type: notificationTypeEnum("type").notNull(),
	message: text("message").notNull(),
	isRead: boolean("is_read").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	linkTo: text("link_to"),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type SpecialPerm = InferSelectModel<typeof specialPerms>;
export type NewSpecialPerm = InferInsertModel<typeof specialPerms>;
export type BuildSession = InferSelectModel<typeof buildSessions>;
export type NewBuildSession = InferInsertModel<typeof buildSessions>;
export type BuildZone = InferSelectModel<typeof buildZones>;
export type NewBuildZone = InferInsertModel<typeof buildZones>;
export type OutreachEvent = InferSelectModel<typeof outreachEvents>;
export type NewOutreachEvent = InferInsertModel<typeof outreachEvents>;
export type OutreachAttendance = InferSelectModel<typeof outreachAttendance>;
export type NewOutreachAttendance = InferInsertModel<typeof outreachAttendance>;
export type OpiSubmission = InferSelectModel<typeof opiSubmissions>;
export type NewOpiSubmission = InferInsertModel<typeof opiSubmissions>;
export type OpiEvent = InferSelectModel<typeof opiEvents>;
export type NewOpiEvent = InferInsertModel<typeof opiEvents>;
export type OpiEventMember = InferSelectModel<typeof opiEventMembers>;
export type NewOpiEventMember = InferInsertModel<typeof opiEventMembers>;
export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;
