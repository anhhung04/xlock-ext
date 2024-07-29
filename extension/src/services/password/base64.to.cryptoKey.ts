export async function base64ToCryptoKey(base64: string): Promise<CryptoKey> {
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
