export default function requestKeyPair(): Promise<{
  privateKey: string
  publicKey: string
}> {
  const id = "dcdmepeacagahbdammaepndegcomiikm"
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      id,
      { type: "REQUEST_KEY_PAIR" },
      function (res: {
        success: boolean
        privateKey: string
        publicKey: string
      }) {
        if (res.success) {
          resolve({ privateKey: res.privateKey, publicKey: res.publicKey })
        } else {
          reject(new Error("CANNOT GET KEY"))
        }
      }
    )
  })
}
