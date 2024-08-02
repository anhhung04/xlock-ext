interface Credentials {
  username: string
  password: string
}

interface AccountCardInfo {
  credentialID: string
  credentials: Credentials
}
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.body.action === "setToken") {
    chrome.storage.session.set({ userToken: request.body.userToken }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting token:", chrome.runtime.lastError)
        sendResponse({ success: false, error: chrome.runtime.lastError })
      } else {
        console.log(`Set token success: ${request.body.userToken}`)
        sendResponse({ success: true })
      }
    })
    return true
  } else if (request.body.action === "getToken") {
    chrome.storage.session.get("userToken", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting token:", chrome.runtime.lastError)
        sendResponse({ success: false, error: chrome.runtime.lastError })
      } else {
        sendResponse({ success: true, userToken: result.userToken })
      }
    })
    return true
  } else if (request.body.action === "getEncryptedToken") {
    chrome.storage.local.get("userToken", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting encrypted token:",
          chrome.runtime.lastError
        )
        sendResponse({ success: false, userToken: "" })
      } else {
        console.log("Encrypted token retrieved successfully", result.userToken)
        sendResponse({ success: true, userToken: result.userToken || "" })
      }
      return true
    })
  } else if (request.body.action === "getSalt") {
    chrome.storage.local.get("salt", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting salt:", chrome.runtime.lastError)
        sendResponse({ success: false, salt: "" })
      } else {
        console.log("Salt retrieved successfully", result.salt)
        sendResponse({ success: true, salt: result.salt || "" })
      }
      return true
    })
  } else if (request.body.action === "setVector") {
    chrome.storage.local.set({ vector: request.body.vector }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting vector:", chrome.runtime.lastError)
        sendResponse({ success: false })
      } else {
        console.log("Vector saved successfully")
        sendResponse({ success: true })
      }
      return true
    })
  } else if (request.body.action === "getVector") {
    chrome.storage.local.get("vector", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting vector:", chrome.runtime.lastError)
        sendResponse({ success: false, vector: "" })
      } else {
        console.log("Vector retrieved successfully", result.vector)
        sendResponse({ success: true, vector: result.vector })
      }
      return true
    })
  } else if (request.body.action === "getDeviceID") {
    chrome.storage.local.get("deviceID", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting deviceID:", chrome.runtime.lastError)
        sendResponse({ success: false, deviceID: "" })
      } else {
        console.log("DeviceID retrieved successfully", result.vector)
        sendResponse({ success: true, deviceID: result.deviceID })
      }
      return true
    })
  } else if (request.body.action === "getTabIcon") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].favIconUrl) {
        sendResponse({ iconUrl: tabs[0].favIconUrl })
      } else {
        sendResponse({ iconUrl: null })
      }
    })
    return true
  } else if (request.body.action === "redirectURL") {
    chrome.tabs.update(sender.tab.id, { url: request.body.url })
  } else if (request.body.action === "fetchAccountCards") {
    const responseData = await fetch("http://localhost:5000/account", {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })
    const data: AccountCardInfo[] = await responseData.json()
    sendResponse(data)
  }
})
