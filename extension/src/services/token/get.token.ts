import { Storage } from "@plasmohq/storage"

import { initCrypto } from "./init.crypto"

export async function getEncryptedToken() {
  initCrypto()
  const storage = new Storage({ area: "local" })
  const encrypted = await storage.get("encryptedToken")

  if (!encrypted) {
    throw new Error(`No token found`)
  }
  return encrypted
}
