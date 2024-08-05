type SaltedKey = {
  key: CryptoKey
  salt: string
}

function bufferToBase64(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString("base64")
}

async function generateSalt(): Promise<string> {
  const saltBuffer = crypto.getRandomValues(new Uint8Array(64))
  return bufferToBase64(saltBuffer)
}

export async function deriveKey(
  password: string,
  existingSalt?: string
): Promise<SaltedKey> {
  const { crypto } = global

  const salt = existingSalt || (await generateSalt())

  const encoder = new TextEncoder()

  const derivationKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 1000,
      hash: "SHA-256"
    },
    derivationKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )

  return {
    key,
    salt
  }
}
