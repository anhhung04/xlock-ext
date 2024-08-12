"use strict"

import { sendToBackground } from "@plasmohq/messaging"

type SaltedKey = {
  key: CryptoKey
  salt: string
}

export class PasswordService {
  static base64ToCryptoKey = async (base64: string): Promise<CryptoKey> => {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const arrayBuffer = bytes.buffer

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      arrayBuffer,
      {
        name: "AES-GCM"
      },
      true,
      ["encrypt", "decrypt"]
    )

    return cryptoKey
  }

  static cryptoKeyToBase64 = async (cryptoKey: CryptoKey): Promise<string> => {
    const exportedKey = await window.crypto.subtle.exportKey("raw", cryptoKey)
    return Buffer.from(exportedKey).toString("base64")
  }

  static bufferToBase64 = (buffer: Uint8Array): string => {
    return Buffer.from(buffer).toString("base64")
  }

  static generateSalt = async (): Promise<string> => {
    const saltBuffer = crypto.getRandomValues(new Uint8Array(64))
    return this.bufferToBase64(saltBuffer)
  }

  static deriveKey = async (
    password: string,
    existingSalt?: string
  ): Promise<SaltedKey> => {
    const { crypto } = global

    const salt = existingSalt || (await this.generateSalt())

    const encoder = new TextEncoder()

    const derivationKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: 1000,
        hash: "SHA-256"
      },
      derivationKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    )

    return {
      key,
      salt
    }
  }

  static saveToSession = async (password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      sendToBackground({
        name: "ping",
        body: {
          action: "setPassword",
          password: password
        }
      })
        .then((response) => {
          if (response.success) {
            resolve()
          } else {
            console.error("Failed to save password")
            reject(new Error("Failed to save password"))
          }
        })
        .catch((error) => {
          console.error("Error sending message to background", error)
          reject(error)
        })
    })
  }

  static getFromSession = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      sendToBackground({
        name: "ping",
        body: {
          action: "getPassword"
        }
      })
        .then((response) => {
          if (response.success) {
            resolve(response.password)
          } else {
            console.error("Failed to get password")
            reject(new Error("Failed to get password"))
          }
        })
        .catch((error) => {
          console.error("Error sending message to background", error)
          reject(error)
        })
    })
  }
}
