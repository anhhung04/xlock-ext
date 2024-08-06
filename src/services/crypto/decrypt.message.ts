import { deriveKey } from "~services/password/password.hash"

type EncryptedVault = {
  salt: string
  initializationVector: string
  cipherText: string
}

function base64ToBuffer(base64: string): Uint8Array {
  if (!base64) {
    throw new Error("Base 64 is not valid")
  }
  const binaryString = Buffer.from(base64, "base64").toString("binary")
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export async function decryptMessage(
  vault: EncryptedVault,
  password: string
): Promise<string> {
  try {
    const { crypto } = global
    const { initializationVector, salt, cipherText } = vault

    const { key } = await deriveKey(password, salt)

    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64ToBuffer(initializationVector) },
      key,
      base64ToBuffer(cipherText)
    )

    return new TextDecoder().decode(decryptedData)
  } catch (error) {
    console.error("Error Message:", error.message)
    throw error
  }
}
