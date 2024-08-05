import { sendToBackground } from "@plasmohq/messaging"

export async function getSalt(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getSalt"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.salt)
        } else {
          reject(new Error("Failed to retreive salt"))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
