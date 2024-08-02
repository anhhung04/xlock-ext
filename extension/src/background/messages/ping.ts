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
    chrome.tabs.create({
      url: request.body.url
    })
    return true
  } else if (request.body.action === "fetchAccountCards") {
    const responseData = await fetch("http://localhost:5000/account", {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })
    const data: AccountCardInfo[] = await responseData.json()
    sendResponse(data)
    return true
  } else if (request.body.action === "openPopup") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("popup.html")
    })
    return true
  } else if (request.body.action === "checkPassword") {
    try {
      chrome.storage.local.get("salt", async (result) => {
        const { crypto } = global

        const salt = result.salt

        const encoder = new TextEncoder()

        const derivationKey = await crypto.subtle.importKey(
          "raw",
          encoder.encode(request.body.password),
          { name: "PBKDF2" },
          false,
          ["deriveKey"]
        )

        const key = await crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 1000,
            hash: "SHA-256"
          },
          derivationKey,
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        )

        const exportedKey = await self.crypto.subtle.exportKey("raw", key)

        let binary = ""
        const bytes = new Uint8Array(exportedKey)
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const hashPassword = btoa(binary)

        const responseData = await fetch(
          "http://localhost:8000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              Password: hashPassword
            })
          }
        )
        if (responseData.status === 200) {
          sendResponse({ success: true })
        } else {
          sendResponse({ success: false })
        }
      })
    } catch (error) {
      console.log("ERROR:::", error)
    }

    return true
  }
})
