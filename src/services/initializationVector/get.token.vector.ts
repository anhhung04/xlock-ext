import { sendToBackground } from "@plasmohq/messaging"

export async function getTokenVector(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getTokenVector"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.vector_token)
        } else {
          reject(new Error("Failed to retreive token vector"))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
