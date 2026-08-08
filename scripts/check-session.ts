import "dotenv/config"

import { sealData, unsealData } from "iron-session"

import type { AdminSessionData } from "../src/lib/auth/session-types"

const password = process.env.SESSION_PASSWORD

if (!password || password.length < 32) {
  throw new Error("SESSION_PASSWORD tidak valid")
}

const original: AdminSessionData = {
  userId: "test-user",
  sessionVersion: 7,
  isLoggedIn: true,
}

const sealed = await sealData(original, {
  password,
  ttl: 60,
})

const restored = await unsealData<AdminSessionData>(sealed, {
  password,
  ttl: 60,
})

const valid =
  restored.userId === original.userId &&
  restored.sessionVersion === original.sessionVersion &&
  restored.isLoggedIn === original.isLoggedIn

console.log("SESSION SEAL:", sealed.length > 0 ? "OK" : "FAIL")
console.log("SESSION UNSEAL:", valid ? "OK" : "FAIL")
console.log("SESSION PAYLOAD MINIMAL:", Object.keys(restored).length === 3 ? "OK" : "FAIL")

if (!valid) {
  process.exit(1)
}
