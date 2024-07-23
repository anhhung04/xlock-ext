import { pbkdf2Sync } from "crypto"

type SaltedKey = {
  key: string
  salt: string
}

function bufferToBase64(buffer: Uint8Array): string {
  let binary = ""
  const len = buffer.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary)
}

async function generateSalt(): Promise<string> {
  const saltBuffer = crypto.getRandomValues(new Uint8Array(64))
  return bufferToBase64(saltBuffer)
}

export async function deriveKey(
  password: string,
  existingSalt?: string
): Promise<SaltedKey> {
  const salt = existingSalt || (await generateSalt())
  const iterations = 1000
  const keyLength = 256 / 32

  const keyBuffer = pbkdf2Sync(password, salt, iterations, keyLength, "sha256")
  const keyString = bufferToBase64(new Uint8Array(keyBuffer))
  return {
    key: keyString,
    salt: salt
  }
}
