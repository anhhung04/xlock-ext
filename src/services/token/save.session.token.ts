import { sendToBackground } from "@plasmohq/messaging"

export async function saveSessionToken(decryptedToken: string): Promise<void> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "setToken",
        userToken: decryptedToken
      }
    })
      .then((response) => {
        if (response.success) {
          console.log("Token saved successfully")
          resolve()
        } else {
          console.error("Failed to save token")
          reject(new Error("Failed to save token"))
        }
      })
      .catch((error) => {
        console.error("Error sending message to background", error)
        reject(error)
      })
  })
}
