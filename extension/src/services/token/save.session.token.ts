export async function saveSessionToken(decryptedToken: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.session.set({ userToken: decryptedToken }, () => {
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
