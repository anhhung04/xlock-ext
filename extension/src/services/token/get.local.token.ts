import { sendToBackground } from "@plasmohq/messaging"

export async function getEncryptedToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getEncryptedToken"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.userToken)
        } else {
          reject(new Error("Failed to retreive encrypted token"))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
