export {}

console.log("background.js is working")

chrome.runtime.onMessageExternal.addListener(function (req, sender, res) {
  if (req.token) {
    console.log("Received token from external webpage:", req.token)

    chrome.storage.local.set({ userToken: req.token }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting token:", chrome.runtime.lastError)
        res({ success: false })
      } else {
        console.log("Token saved successfully")
        res({ success: true })
      }
    })
    return true
  } else {
    res({ success: false })
  }
})

chrome.windows.onRemoved.addListener((windowID) => {
  chrome.windows.getAll({}, (windows) => {
    if (windows.length === 0) {
      chrome.storage.session.clear(() => {
        if (chrome.runtime.lastError) {
          console.error(
            `Error clearing session storage:`,
            chrome.runtime.lastError
          )
        } else {
          console.error(`Session storage cleared successfully`)
        }
      })
    }
  })
})
