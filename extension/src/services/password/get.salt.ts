import { Storage } from "@plasmohq/storage"

import { initCrypto } from "~services/token/init.crypto"

export async function getSalt() {
  initCrypto()
  const storage = new Storage({ area: "local" })
  const salt = await storage.get("salt")
  if (!salt) {
    throw new Error(`No salt found`)
  }
  return salt
}
