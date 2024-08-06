import { sendToBackground } from "@plasmohq/messaging"

export async function getPrivateKeyVector(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getPrivateKeyVector"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.vector)
        } else {
          reject(new Error("Failed to retreive private key vector"))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
