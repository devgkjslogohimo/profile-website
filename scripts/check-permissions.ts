import { hasPermission } from "../src/lib/auth/permissions"

const checks = [
  {
    name: "SUPER ADMIN — USER MANAGEMENT",
    result: hasPermission("SUPER_ADMIN", "users.manage"),
    expected: true,
  },
  {
    name: "ADMIN — USER MANAGEMENT DENIED",
    result: hasPermission("ADMIN", "users.manage"),
    expected: false,
  },
  {
    name: "ADMIN — CHURCH MANAGEMENT",
    result: hasPermission("ADMIN", "church.manage"),
    expected: true,
  },
  {
    name: "EDITOR — PUBLISH",
    result: hasPermission("EDITOR", "content.publish"),
    expected: true,
  },
  {
    name: "CONTRIBUTOR — EDIT OWN",
    result: hasPermission("CONTRIBUTOR", "content.edit.own"),
    expected: true,
  },
  {
    name: "CONTRIBUTOR — EDIT ANY DENIED",
    result: hasPermission("CONTRIBUTOR", "content.edit.any"),
    expected: false,
  },
  {
    name: "CONTRIBUTOR — PUBLISH DENIED",
    result: hasPermission("CONTRIBUTOR", "content.publish"),
    expected: false,
  },
]

let failed = false

for (const check of checks) {
  const valid = check.result === check.expected

  console.log(`${check.name}: ${valid ? "OK" : "FAIL"}`)

  if (!valid) {
    failed = true
  }
}

if (failed) {
  process.exit(1)
}
