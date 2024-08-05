import { deriveKey } from "~services/password/password.hash"

type EncryptedVault = {
  salt: string
  initializationVector: string
  cipherText: string
}

function bufferToBase64(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString("base64")
}

export async function encryptMessage(
  message: string,
  password: string,
  existingSalt?: string
): Promise<EncryptedVault> {
  const encoder = new TextEncoder()
  const encodedPlaintext = encoder.encode(message)

  const { key, salt } = await deriveKey(password, existingSalt)
  const initializationVector = crypto.getRandomValues(new Uint8Array(16))

  const cipherText = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: initializationVector },
    key,
    encodedPlaintext
  )

  const encryptedVault: EncryptedVault = {
    salt,
    initializationVector: bufferToBase64(initializationVector),
    cipherText: bufferToBase64(new Uint8Array(cipherText))
  }

  return encryptedVault
}
