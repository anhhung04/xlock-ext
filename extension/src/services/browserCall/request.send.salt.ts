export default function requestSendSalt(salt: string): Promise<void> {
  const id = "dcdmepeacagahbdammaepndegcomiikm"

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      id,
      { salt: salt },
      (res: { success: boolean; type: "SEND_SALT" }) => {
        if (res.success) {
          console.log("SEND SALT SUCCESS")
          resolve()
        } else {
          console.log("SEND SALT FAILED")
          reject(new Error("SEND SALT FAILED"))
        }
      }
    )
  })
}
