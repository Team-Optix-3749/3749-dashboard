import { db } from './db'

export type Role =
  | 'OWNER'
  | 'OFFICER'
  | 'LEADERSHIP'
  | 'MEMBER'
  | 'PENDING'

export type SpecialPerm =
  | 'OPI_PERMS'
  | 'BUILD_PERMS'
  | 'FINANCE_PERMS'
  | 'SPONSOR_PERMS'
  | 'SCHEDULE_PERMS'

export const PERMISSION_MATRIX = {
  VIEW_FINANCE: ['OWNER', 'OFFICER', 'LEADERSHIP'],
  EDIT_BUDGET: ['OWNER', 'OFFICER'],
  ADD_TRANSACTION: ['OWNER', 'OFFICER'],
  EXPORT_FINANCE: ['OWNER', 'OFFICER', 'LEADERSHIP'],

  VIEW_SPONSORS: ['OWNER', 'OFFICER', 'LEADERSHIP', 'MEMBER'],
  EDIT_SPONSOR_DB: ['OWNER', 'OFFICER'],
  CHANGE_SPONSOR_STATUS: ['OWNER', 'OFFICER'],
  VIEW_TEMPLATES: ['OWNER', 'OFFICER', 'LEADERSHIP', 'MEMBER'],

  SUBMIT_OPI: ['OWNER', 'OFFICER', 'LEADERSHIP', 'MEMBER'],
  REVIEW_OPI: ['OWNER', 'OFFICER'],
  EDIT_OPI_DB: ['OWNER'],
  VIEW_OPI_ADMIN: ['OWNER', 'OFFICER'],
  VIEW_OPI_PUBLIC: ['OWNER', 'OFFICER', 'LEADERSHIP', 'MEMBER'],

  VIEW_BUILD_HOURS: ['OWNER', 'OFFICER', 'LEADERSHIP', 'MEMBER'],
  CONFIG_ZONES: ['OWNER'],
  MANUAL_HOUR_ADJUST: ['OWNER'],

  VIEW_MEMBERS: ['OWNER', 'OFFICER', 'LEADERSHIP'],
  VERIFY_MEMBER: ['OWNER', 'OFFICER'],
  REMOVE_MEMBER: ['OWNER', 'OFFICER'],

  VIEW_ROLES: ['OWNER', 'OFFICER'],
  ASSIGN_STANDARD_ROLE: ['OWNER', 'OFFICER'],
  ASSIGN_SPECIAL_PERM: ['OWNER'],
  TRANSFER_OWNERSHIP: ['OWNER'],

  VIEW_CALENDAR: ['OWNER', 'OFFICER', 'LEADERSHIP', 'MEMBER'],
  VIEW_LEADERSHIP_EVENTS: ['OWNER', 'OFFICER', 'LEADERSHIP'],
  CREATE_EVENT: ['OWNER', 'OFFICER', 'LEADERSHIP'],
  DELETE_EVENT: ['OWNER', 'OFFICER'],

  VIEW_COMP_SCHEDULE: ['OWNER', 'OFFICER', 'LEADERSHIP', 'MEMBER'],
  EDIT_COMP_SCHEDULE: ['OWNER', 'OFFICER'],
} as const

export async function hasPermission(
  userId: string,
  permission: keyof typeof PERMISSION_MATRIX,
  specialPerm?: SpecialPerm
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { specialPerms: true }
  })
  if (!user) return false

  const allowedRoles = PERMISSION_MATRIX[permission]
  const hasRole = allowedRoles.includes(user.role as any)
  const hasSpecialPerm = specialPerm
    ? user.specialPerms.some((p: any) => p.name === specialPerm)
    : false

  return hasRole || hasSpecialPerm
}
