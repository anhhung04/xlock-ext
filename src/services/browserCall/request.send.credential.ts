import { sendToBackground } from "@plasmohq/messaging"

interface Credential {
  name: string
  site: string
  description: string
  credentials: {
    username: string
    password: string
  }
  logo_url: string
}

export default function requestSendCredential(data: Credential): Promise<void> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "sendData",
        data: data
      }
    })
      .then((response) => {
        if (response.success) {
          console.log("Data send successfully")
          resolve()
        } else {
          console.error("Failed to send data")
          reject(new Error("Failed to send data"))
        }
      })
      .catch((error) => {
        console.error("Error sending message to background", error)
        reject(error)
      })
  })
}
