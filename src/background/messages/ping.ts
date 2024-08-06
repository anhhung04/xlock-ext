import type { ItemModel, ShareItemModel } from "~components/types/Item"
import { apiCall } from "~services/api/api"

export default {}

const getURL = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0]
      if (currentTab && currentTab.url) {
        const parsedURL = new URL(currentTab.url)
        const port = parsedURL.port ? `:${parsedURL.port}` : ""
        const mainURL = `${parsedURL.protocol}//${parsedURL.hostname}${port}`
        resolve(mainURL)
      } else {
        reject("No active tab found or tab URL is missing")
      }
    })
  })
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.body.action === "setToken") {
    chrome.storage.session.set({ user_token: request.body.userToken }, () => {
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
    chrome.storage.session.get("user_token", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting token:", chrome.runtime.lastError)
        sendResponse({ success: false, error: chrome.runtime.lastError })
      } else {
        sendResponse({ success: true, user_token: result.user_token || "" })
      }
    })
    return true
  } else if (request.body.action === "getEncryptedToken") {
    chrome.storage.local.get("user_token", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting encrypted token:",
          chrome.runtime.lastError
        )
        sendResponse({ success: false, user_token: "" })
      } else {
        sendResponse({ success: true, user_token: result.user_token || "" })
      }
      return true
    })
  } else if (request.body.action === "getSaltPrivateKey") {
    chrome.storage.local.get("salt_private_key", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting salt private key:",
          chrome.runtime.lastError
        )
        sendResponse({ success: false, salt_private_key: "" })
      } else {
        console.log(
          "Salt private key retrieved successfully",
          result.salt_private_key
        )
        sendResponse({
          success: true,
          salt_private_key: result.salt_private_key
        })
      }
      return true
    })
  } else if (request.body.action === "getSaltToken") {
    chrome.storage.local.get("salt_token", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting salt token:", chrome.runtime.lastError)
        sendResponse({ success: false, salt_token: "" })
      } else {
        console.log("Salt token retrieved successfully", result.salt_token)
        sendResponse({ success: true, salt_token: result.salt_token })
      }
      return true
    })
  } else if (request.body.action === "getPrivateKeyVector") {
    chrome.storage.local.get("vector_private_key", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting private key vector:",
          chrome.runtime.lastError
        )
        sendResponse({ success: false, vector: "" })
      } else {
        console.log(
          "Private key vector retrieved successfully",
          result.vector_private_key
        )
        sendResponse({ success: true, vector: result.vector_private_key })
      }
      return true
    })
  } else if (request.body.action === "getTokenVector") {
    chrome.storage.local.get("vector_token", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting token vector:", chrome.runtime.lastError)
        sendResponse({ success: false, vector: "" })
      } else {
        console.log("Token vector retrieved successfully", result.vector_token)
        sendResponse({ success: true, vector_token: result.vector_token })
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
    const mainURL = await getURL()
    chrome.storage.session.get("user_token", async (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting token:", chrome.runtime.lastError)
        sendResponse({ success: false, error: chrome.runtime.lastError })
      } else {
        const responseData = await apiCall(
          `/api/v1/items/?site=${mainURL}`,
          "GET",
          null,
          result.user_token
        )
        if (responseData["code"] === 401) {
          throw new Error(responseData["message"])
        }
        console.log(responseData)
        const listAccountCards: (ItemModel | ShareItemModel)[] =
          responseData.data
        sendResponse({ success: true, data: listAccountCards })
      }
    })
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
  } else if (request.body.action === "setPassword") {
    chrome.storage.session.set({ password: request.body.password }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting password:", chrome.runtime.lastError)
        sendResponse({ success: false })
      } else {
        console.log("Password saved successfully")
        sendResponse({ success: true })
      }
      return true
    })
  } else if (request.body.action === "setItem") {
    const saltKey = `salt_item_${request.body.id}`
    const saltValue = request.body.salt
    const vectorKey = `vector_item_${request.body.id}`
    const vectorValue = request.body.vector
    chrome.storage.local.set({ [saltKey]: saltValue }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting salt item:", chrome.runtime.lastError)
        sendResponse({ success: false })
        return true
      }
    })
    chrome.storage.local.set({ [vectorKey]: vectorValue }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting vector item:", chrome.runtime.lastError)
        sendResponse({ success: false })
        return true
      }
    })
    sendResponse({ success: true })
    return true
  } else if (request.body.action === "getItem") {
    const saltKey = `salt_item_${request.body.id}`
    const vectorKey = `vector_item_${request.body.id}`

    chrome.storage.local.get([saltKey, vectorKey], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting salt or vector:", chrome.runtime.lastError)
        sendResponse({ success: false, salt: "", vector: "" })
        return true
      }

      const saltValue = result[saltKey] || ""
      const vectorValue = result[vectorKey] || ""

      console.log("Salt value:", saltValue)
      console.log("Vector value:", vectorValue)

      sendResponse({ success: true, salt: saltValue, vector: vectorValue })
      return true
    })
  } else if (request.body.action === "getPassword") {
    chrome.storage.session.get("password", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting password:", chrome.runtime.lastError)
        sendResponse({ success: false, password: "" })
      } else {
        sendResponse({ success: true, password: result.password })
      }
      return true
    })
  }
})
