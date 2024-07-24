import { AES } from "@originjs/crypto-js-wasm"

import { initCrypto } from "./init.crypto"

export async function encryptToken(token: string, hashPassword: string) {
  await initCrypto()

  const encrypted = AES.encrypt(token, hashPassword).toString()

  return encrypted
}
