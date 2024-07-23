import { Storage } from "@plasmohq/storage"

import { initCrypto } from "~services/token/init.crypto"

export async function saveSalt(salt: string): Promise<void> {
  initCrypto()
  const storage = new Storage({ area: "local" })
  await storage.set("salt", salt)
}
