import { AES, enc } from "@originjs/crypto-js-wasm"

import { deriveKey } from "~services/password/password.hash"

import { initCrypto } from "./init.crypto"

export async function decryptToken(
  encryptedToken: string,
  password: string,
  salt: string
) {
  await initCrypto()
  const { key } = await deriveKey(password, salt)
  const bytes = AES.decrypt(encryptedToken, key)
  const decrypted = bytes.toString(enc.Utf8)
  return decrypted
}
