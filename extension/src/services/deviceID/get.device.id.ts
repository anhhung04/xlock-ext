export async function getDeviceID(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("deviceID", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting deviceID:", chrome.runtime.lastError)
        reject("")
      } else {
        if (result.deviceID) {
          resolve(result.deviceID)
        } else {
          resolve("")
        }
      }
    })
  })
}
