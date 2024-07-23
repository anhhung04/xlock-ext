import { Storage } from "@plasmohq/storage"

import { initCrypto } from "./init.crypto"

export async function saveToken(encryptedToken: string) {
  initCrypto()
  const storage = new Storage({ area: "local" })
  await storage.set("encryptedToken", encryptedToken)
}
