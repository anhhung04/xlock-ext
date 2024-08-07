import { sendToBackground } from "@plasmohq/messaging"

export async function getEncryptedPrivateKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getEncryptedPrivateKey"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.enc_pri)
        } else {
          reject(new Error("Failed to retreive encrypted private key"))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
