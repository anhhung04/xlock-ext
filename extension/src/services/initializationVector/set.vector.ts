import { sendToBackground } from "@plasmohq/messaging"

export async function setInitialzationVector(vector: string): Promise<void> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "setVector",
        vector: vector
      }
    })
      .then((response) => {
        if (response.success) {
          console.log("Vector saved successfully")
          resolve()
        } else {
          console.error("Failed to save vector")
          reject(new Error("Failed to save vector"))
        }
      })
      .catch((error) => {
        console.error("Error sending message to background", error)
        reject(error)
      })
  })
}
