import { sendToBackground } from "@plasmohq/messaging"

export async function getSaltToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getSaltToken"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.salt_token)
        } else {
          reject(new Error("Failed to retreive salt token"))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
