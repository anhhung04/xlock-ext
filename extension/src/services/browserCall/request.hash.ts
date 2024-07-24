export default function requestHashPassword(
  password: string
): Promise<{ password: string; salt: string }> {
  return new Promise((resolve, reject) => {
    const id = "dcdmepeacagahbdammaepndegcomiikm"
    chrome.runtime.sendMessage(
      id,
      { type: "REQUEST_HASH_PASSWORD", password: password },
      (res: { success: boolean; password: string; salt: string }) => {
        if (res.success) {
          resolve({ password: res.password, salt: res.salt })
        } else {
          reject(new Error("There is some error"))
        }
      }
    )
  })
}
