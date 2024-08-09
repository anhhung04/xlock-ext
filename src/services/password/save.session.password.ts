import { sendToBackground } from "@plasmohq/messaging"

export async function saveSessionPassword(password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "setPassword",
        password: password
      }
    })
      .then((response) => {
        if (response.success) {
          console.log("Password saved successfully")
          resolve()
        } else {
          console.error("Failed to save password")
          reject(new Error("Failed to save password"))
        }
      })
      .catch((error) => {
        console.error("Error sending message to background", error)
        reject(error)
      })
  })
}
