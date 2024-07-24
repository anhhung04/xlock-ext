import { AES, enc } from "@originjs/crypto-js-wasm"

import { initCrypto } from "./init.crypto"

export async function decryptToken(
  encryptedToken: string,
  passwordHash: string
) {
  await initCrypto()
  const bytes = AES.decrypt(encryptedToken, passwordHash)
  const decrypted = bytes.toString(enc.Utf8)
  return decrypted
}
