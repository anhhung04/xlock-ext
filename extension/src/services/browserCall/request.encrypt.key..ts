export function requestEncryptPrivateKey(
  privateKey: string,
  hashPassword: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const id = "dcdmepeacagahbdammaepndegcomiikm"
    chrome.runtime.sendMessage(
      id,
      {
        type: "REQUEST_ENCRYPT_PRIVATE_KEY",
        privateKey: privateKey,
        hashPassword: hashPassword
      },
      (res: { success: boolean; encryptedPrivateKey: string }) => {
        if (res.success) {
          resolve(res.encryptedPrivateKey)
        } else {
          reject(new Error("There is some error"))
        }
      }
    )
  })
}
