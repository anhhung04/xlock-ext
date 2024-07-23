export async function getSessionToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.session.get("userToken", (result) => {
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
