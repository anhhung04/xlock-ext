import { Buffer } from "buffer"

function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  const binary = Buffer.from(arrayBuffer).toString("binary")
  const base64 = Buffer.from(binary, "binary").toString("base64")
  return base64
}

export default async function generateKeyPair(): Promise<{
  privateKey: string
  publicKey: string
}> {
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

  // export the key
  const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey)
  const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)

  // convert key to PEM format
  const publicKeyBase64 = arrayBufferToBase64(publicKey)
  const privateKeyBase64 = arrayBufferToBase64(privateKey)

  return {
    privateKey: privateKeyBase64,
    publicKey: publicKeyBase64
  }
}
