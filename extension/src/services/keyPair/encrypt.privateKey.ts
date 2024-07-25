import { AES } from "@originjs/crypto-js-wasm"

import { initCrypto } from "~services/token/init.crypto"

export async function encryptPrivateKey(
  privateKey: string,
  hashPassword: string
) {
  await initCrypto()
  const encryptedPrivateKey = AES.encrypt(privateKey, hashPassword).toString()
  return encryptedPrivateKey
}
