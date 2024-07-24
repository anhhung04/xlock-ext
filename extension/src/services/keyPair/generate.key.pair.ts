import { Buffer } from "buffer"

function arrayBufferToPem(arrayBuffer, label) {
  const binary = Buffer.from(arrayBuffer).toString("binary")
  const base64 = Buffer.from(binary, "binary").toString("base64")
  const pem = [
    `-----BEGIN ${label}-----`,
    ...base64.match(/.{1,64}/g),
    `-----END ${label}-----`
  ].join("\n")
  return pem
}

export default async function generateKeyPair(): Promise<{
  privateKey: string
  publicKey: string
}> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-PSS",
      modulusLength: 4096,
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
  const publicKeyPem = arrayBufferToPem(publicKey, "PUBLIC KEY")
  const privateKeyPem = arrayBufferToPem(privateKey, "PRIVATE KEY")

  return {
    privateKey: privateKeyPem,
    publicKey: publicKeyPem
  }
}
