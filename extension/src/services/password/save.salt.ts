export async function saveSalt(salt: string): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ salt: salt }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting salt:", chrome.runtime.lastError)
        reject(chrome.runtime.lastError)
      } else {
        console.log("Salt saved successfully")
        resolve()
      }
    })
  })
}
