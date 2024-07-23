export async function saveToken(encryptedToken: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ userToken: encryptedToken }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting token:", chrome.runtime.lastError)
        reject(chrome.runtime.lastError)
      } else {
        console.log("Token saved successfully")
        resolve()
      }
    })
  })
}
