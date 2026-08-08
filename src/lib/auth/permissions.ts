type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONTRIBUTOR"

const permissions = [
  "dashboard.view",
  "content.create",
  "content.edit.own",
  "content.edit.any",
  "content.publish",
  "church.manage",
  "submissions.manage",
  "users.manage",
  "settings.manage",
] as const

type Permission = (typeof permissions)[number]

const rolePermissions = {
  SUPER_ADMIN: permissions,
  ADMIN: [
    "dashboard.view",
    "content.create",
    "content.edit.own",
    "content.edit.any",
    "content.publish",
    "church.manage",
    "submissions.manage",
  ],
  EDITOR: [
    "dashboard.view",
    "content.create",
    "content.edit.own",
    "content.edit.any",
    "content.publish",
  ],
  CONTRIBUTOR: ["dashboard.view", "content.create", "content.edit.own"],
} satisfies Record<AdminRole, readonly Permission[]>

function hasPermission(role: AdminRole, permission: Permission): boolean {
  return (rolePermissions[role] as readonly Permission[]).includes(permission)
}

export { hasPermission, permissions, rolePermissions }
export type { AdminRole, Permission }
