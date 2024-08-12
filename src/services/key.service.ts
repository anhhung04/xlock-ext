"use strict"

import { Buffer } from "buffer"

import { sendToBackground } from "@plasmohq/messaging"

export class KeyService {
  static arrayBufferToBase64 = (arrayBuffer: ArrayBuffer): string => {
    const binary = Buffer.from(arrayBuffer).toString("binary")
    const base64 = Buffer.from(binary, "binary").toString("base64")
    return base64
  }

  static generateKeyPair = async (): Promise<{
    privateKey: string
    publicKey: string
  }> => {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 1024,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      },
      true,
      ["sign", "verify"]
    )

    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey)
    const privateKey = await crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    )

    const publicKeyBase64 = this.arrayBufferToBase64(publicKey)
    const privateKeyBase64 = this.arrayBufferToBase64(privateKey)

    return {
      privateKey: privateKeyBase64,
      publicKey: publicKeyBase64
    }
  }

  static getEncryptedPrivateKey = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      sendToBackground({
        name: "ping",
        body: {
          action: "getEncryptedPrivateKey"
        }
      })
        .then((response) => {
          if (response.success) {
            resolve(response.enc_pri)
          } else {
            reject(new Error("Failed to retreive encrypted private key"))
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
