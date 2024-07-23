import { AES } from "@originjs/crypto-js-wasm"

import { deriveKey } from "~services/password/password.hash"
import { saveSalt } from "~services/password/save.salt"

import { initCrypto } from "./init.crypto"
import { saveToken } from "./save.local.token"

export async function encryptToken(token: string, password: string) {
  await initCrypto()
  const { key, salt } = await deriveKey(password)

  const encrypted = AES.encrypt(token, key).toString()

  await saveToken(encrypted)
  await saveSalt(salt)
  return {
    encrypted,
    salt
  }
}
