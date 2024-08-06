import { sendToBackground } from "@plasmohq/messaging"

export async function getSessionPassword(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getPassword"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.password)
        } else {
          console.error("Failed to get password")
          reject(new Error("Failed to get password"))
        }
      })
      .catch((error) => {
        console.error("Error sending message to background", error)
        reject(error)
      })
  })
}
