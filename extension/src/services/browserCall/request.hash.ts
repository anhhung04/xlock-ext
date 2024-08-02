export default function requestHashPassword(
  password: string,
  salt?: string
): Promise<{ password: string; salt: string }> {
  return new Promise((resolve, reject) => {
    const id = "dcdmepeacagahbdammaepndegcomiikm"

    chrome.runtime.sendMessage(
      id,
      { type: "REQUEST_HASH_PASSWORD", password: password, salt: salt },
      async (res: { success: boolean; password: string; salt: string }) => {
        if (res.success) {
          try {
            resolve({ password: password, salt: res.salt })
          } catch (error) {
            reject(new Error("Error hasing password " + error))
          }
        } else {
          reject(new Error("There is some error"))
        }
      }
    )
  })
}
