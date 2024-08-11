"use strict"

import { PasswordService } from "./password.service"

type EncryptedVault = {
  salt: string
  initializationVector: string
  cipherText: string
}

export class CryptoService {
  static bufferToBase64(buffer: Uint8Array): string {
    return Buffer.from(buffer).toString("base64")
  }

  static base64ToBuffer(base64: string): Uint8Array {
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

  static concatenateData = (
    cipherText: string,
    initializationVector: string,
    salt: string
  ): string => {
    return `${initializationVector}::${salt}::${cipherText}`
  }

  static encryptMessage = async (
    message: string,
    password: string
  ): Promise<EncryptedVault> => {
    const encoder = new TextEncoder()
    const encodedPlaintext = encoder.encode(message)

    const { key, salt } = await PasswordService.deriveKey(password)
    const initializationVector = crypto.getRandomValues(new Uint8Array(16))

    const cipherText = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: initializationVector },
      key,
      encodedPlaintext
    )

    const encryptedVault: EncryptedVault = {
      salt,
      initializationVector: this.bufferToBase64(initializationVector),
      cipherText: this.bufferToBase64(new Uint8Array(cipherText))
    }

    return encryptedVault
  }

  static decryptMessage = async (
    vault: EncryptedVault,
    password: string
  ): Promise<string> => {
    try {
      const { crypto } = global
      const { initializationVector, salt, cipherText } = vault

      const { key } = await PasswordService.deriveKey(password, salt)

      const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: this.base64ToBuffer(initializationVector) },
        key,
        this.base64ToBuffer(cipherText)
      )

      return new TextDecoder().decode(decryptedData)
    } catch (error) {
      console.error("Error Message:", error.message)
      throw error
    }
  }
}
