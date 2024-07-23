export async function getSalt(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("salt", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting salt:", chrome.runtime.lastError)
        reject("")
      } else {
        if (result.salt) {
          resolve(result.salt)
        } else {
          resolve("")
        }
      }
    })
  })
}
