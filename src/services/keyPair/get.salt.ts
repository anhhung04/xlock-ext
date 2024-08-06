import { sendToBackground } from "@plasmohq/messaging"

export async function getSaltPrivateKey(): Promise<string> {
  return new Promise((resolve, reject) => {
    sendToBackground({
      name: "ping",
      body: {
        action: "getSaltPrivateKey"
      }
    })
      .then((response) => {
        if (response.success) {
          resolve(response.salt_private_key)
        } else {
          reject(new Error("Failed to retreive salt private key"))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
