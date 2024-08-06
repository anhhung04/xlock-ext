import { sendToBackground } from "@plasmohq/messaging"

export async function getSessionToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: { action: "getToken" }
    })
      .then((response) => {
        if (response.success && response.user_token) {
          resolve(response.user_token)
        } else {
          console.error("Failed to retrieve token")
          reject(new Error("Failed to retrieve token"))
        }
      })
      .catch((error) => {
        console.error("Error sending message to background", error)
        reject(error)
      })
  })
}
