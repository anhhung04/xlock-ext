import { sendToBackground } from "@plasmohq/messaging"

export async function getDeviceID(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getDeviceID"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.deviceID)
        } else {
          reject(new Error("Failed to retreive deviceID"))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
