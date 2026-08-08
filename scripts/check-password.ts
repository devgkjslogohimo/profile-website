import { hashPassword, verifyPassword } from "../src/lib/auth/password"

const password = "GKJSlogohimo-Test-2026!"
const wrongPassword = "password-yang-salah"

const firstHash = await hashPassword(password)
const secondHash = await hashPassword(password)

const validPassword = await verifyPassword(password, firstHash)
const invalidPassword = await verifyPassword(wrongPassword, firstHash)
const invalidFormat = await verifyPassword(password, "invalid-hash")
const uniqueSalt = firstHash !== secondHash

console.log("HASH PREFIX:", firstHash.startsWith("scrypt$v1$") ? "OK" : "FAIL")
console.log("CORRECT PASSWORD:", validPassword ? "OK" : "FAIL")
console.log("WRONG PASSWORD:", !invalidPassword ? "OK" : "FAIL")
console.log("INVALID HASH:", !invalidFormat ? "OK" : "FAIL")
console.log("UNIQUE SALT:", uniqueSalt ? "OK" : "FAIL")

if (!validPassword || invalidPassword || invalidFormat || !uniqueSalt) {
  process.exit(1)
}
