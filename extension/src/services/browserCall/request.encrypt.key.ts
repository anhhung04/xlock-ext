export function requestEncryptPrivateKey(
  privateKey: string,
  password: string
): Promise<{
  encryptedPrivateKey: string
  salt: string
  initializationVector: string
}> {
  return new Promise((resolve, reject) => {
    const id = "dcdmepeacagahbdammaepndegcomiikm"
    chrome.runtime.sendMessage(
      id,
      {
        type: "REQUEST_ENCRYPT_PRIVATE_KEY",
        privateKey: privateKey,
        password: password
      },
      (res: {
        success: boolean
        encryptedPrivateKey: string
        salt: string
        initializationVector: string
      }) => {
        if (res.success) {
          resolve({
            encryptedPrivateKey: res.encryptedPrivateKey,
            salt: res.salt,
            initializationVector: res.initializationVector
          })
        } else {
          reject(new Error("There is some error"))
        }
      }
    )
  })
}
