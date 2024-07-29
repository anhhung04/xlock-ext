export async function cryptoKeyToBase64(cryptoKey: CryptoKey): Promise<string> {
  const exportedKey = await window.crypto.subtle.exportKey("raw", cryptoKey)
  return Buffer.from(exportedKey).toString("base64")
}
