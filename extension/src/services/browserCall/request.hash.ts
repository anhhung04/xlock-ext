export default function requestHashPassword(
  password: string
): Promise<{ password: CryptoKey; salt: string }> {
  return new Promise((resolve, reject) => {
    const id = "dcdmepeacagahbdammaepndegcomiikm"

    chrome.runtime.sendMessage(
      id,
      { type: "REQUEST_HASH_PASSWORD", password: password },
      async (res: { success: boolean; password: string; salt: string }) => {
        if (res.success) {
          try {
            const binaryString = atob(res.password)
            const len = binaryString.length
            const bytes = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            const arrayBuffer = bytes.buffer
            const importedKey = await window.crypto.subtle.importKey(
              "raw",
              arrayBuffer,
              { name: "AES-GCM", length: 256 },
              true,
              ["encrypt", "decrypt"]
            )
            resolve({ password: importedKey, salt: res.salt })
          } catch (error) {
            reject(new Error("Error importing CryptoKey: " + error))
          }
        } else {
          reject(new Error("There is some error"))
        }
      }
    )
  })
}
