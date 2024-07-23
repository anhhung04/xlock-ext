export async function getEncryptedToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("userToken", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting token:", chrome.runtime.lastError)
        reject("")
      } else {
        if (result.userToken) {
          resolve(result.userToken)
        } else {
          resolve("")
        }
      }
    })
  })
}
