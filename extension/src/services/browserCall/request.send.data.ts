export default function requestSendData(
  access_token: string,
  password: string,
  salt: string
): Promise<void> {
  const id = "dcdmepeacagahbdammaepndegcomiikm"

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      id,
      {
        access_token: access_token,
        type: "SEND_DATA",
        password: password,
        salt: salt
      },
      (res: { success: boolean }) => {
        if (res.success) {
          resolve()
        } else {
          reject(new Error("SEND TOKEN FAILED"))
        }
      }
    )
  })
}
