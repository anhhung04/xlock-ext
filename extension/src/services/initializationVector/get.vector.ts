import { sendToBackground } from "@plasmohq/messaging"

export async function getInitializationVector(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getVector"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.vector)
        } else {
          reject(new Error("Failed to retreive vector"))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
