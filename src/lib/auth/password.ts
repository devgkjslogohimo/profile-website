import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"

const ALGORITHM = "scrypt"
const VERSION = "v1"

const KEY_LENGTH = 64
const SALT_LENGTH = 16

const SCRYPT_N = 16_384
const SCRYPT_R = 8
const SCRYPT_P = 1
const SCRYPT_MAXMEM = 32 * 1024 * 1024

function deriveKey(
  password: string,
  salt: Buffer,
  n: number,
  r: number,
  p: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      KEY_LENGTH,
      {
        N: n,
        r,
        p,
        maxmem: SCRYPT_MAXMEM,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error)
          return
        }

        resolve(derivedKey)
      }
    )
  })
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH)
  const derivedKey = await deriveKey(password, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P)

  return [
    ALGORITHM,
    VERSION,
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$")
}

async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  try {
    const [algorithm, version, nRaw, rRaw, pRaw, saltRaw, hashRaw, ...extra] =
      encodedHash.split("$")

    if (
      algorithm !== ALGORITHM ||
      version !== VERSION ||
      !nRaw ||
      !rRaw ||
      !pRaw ||
      !saltRaw ||
      !hashRaw ||
      extra.length > 0
    ) {
      return false
    }

    const n = Number(nRaw)
    const r = Number(rRaw)
    const p = Number(pRaw)

    if (
      !Number.isSafeInteger(n) ||
      !Number.isSafeInteger(r) ||
      !Number.isSafeInteger(p) ||
      n <= 1 ||
      r <= 0 ||
      p <= 0
    ) {
      return false
    }

    const salt = Buffer.from(saltRaw, "base64url")
    const expectedKey = Buffer.from(hashRaw, "base64url")

    if (salt.length !== SALT_LENGTH || expectedKey.length !== KEY_LENGTH) {
      return false
    }

    const actualKey = await deriveKey(password, salt, n, r, p)

    if (actualKey.length !== expectedKey.length) {
      return false
    }

    return timingSafeEqual(actualKey, expectedKey)
  } catch {
    return false
  }
}

export { hashPassword, verifyPassword }
