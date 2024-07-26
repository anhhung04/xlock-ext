import generateDeviceId from "~services/deviceID/generate.device.id"
import { encryptPrivateKey } from "~services/keyPair/encrypt.privateKey"
import generateKeyPair from "~services/keyPair/generate.key.pair"
import { deriveKey } from "~services/password/password.hash"
import { encryptToken } from "~services/token/encrypt.token"

export {}

console.log("background.js is working")

chrome.runtime.onMessageExternal.addListener(async function (req, sender, res) {
  if (req.type === "SEND_DATA") {
    if (req.access_token) {
      const {
        salt,
        initializationVector,
        cipherText: encryptedToken
      } = await encryptToken(req.access_token, req.password, req.salt)
      chrome.storage.local.set({ userToken: encryptedToken }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error setting token:", chrome.runtime.lastError)
          res({ success: false })
        } else {
          console.log("Token saved successfully")
          res({ success: true })
        }
      })

      chrome.storage.local.set({ salt: salt }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error setting salt:", chrome.runtime.lastError)
          res({ success: false })
        } else {
          console.log("Salt saved successfully")
          res({ success: true })
        }
      })

      chrome.storage.local.set({ vector: initializationVector }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error setting vector:", chrome.runtime.lastError)
          res({ success: false })
        } else {
          console.log("vector saved successfully")
          res({ success: true })
        }
      })
      return true
    } else {
      res({ success: false })
    }
  } else if (req.type === "REQUEST_DEVICE_ID") {
    try {
      const deviceID = generateDeviceId()
      chrome.storage.local.set({ deviceID: deviceID }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error setting deviceID:", chrome.runtime.lastError)
          res({ success: false, deviceID: "" })
        } else {
          console.log("DeviceID saved successfully")
          res({ success: true, deviceID: deviceID })
        }
      })
      res({ success: true, deviceID: deviceID })
    } catch (error) {
      console.error("Error generating device ID:", error)
      res({ success: false, deviceID: "" })
    }
  } else if (req.type === "REQUEST_HASH_PASSWORD") {
    try {
      const { key: hashPassword, salt: salt } = await deriveKey(req.password)
      res({ success: true, password: hashPassword, salt: salt })
    } catch (error) {
      console.error("Error hashing password:", error)
      res({ success: false, password: "", salt: "" })
    }
  } else if (req.type === "REQUEST_KEY_PAIR") {
    try {
      const { privateKey: privateKey, publicKey: publicKey } =
        await generateKeyPair()
      res({ success: true, privateKey: privateKey, publicKey: publicKey })
    } catch (error) {
      console.error("Error generate key:", error)
      res({ success: false, privateKey: "", publicKey: "" })
    }
  } else if (req.type === "REQUEST_ENCRYPT_PRIVATE_KEY") {
    try {
      const exportedKey = await window.crypto.subtle.exportKey(
        "raw",
        req.hashPassword
      )
      const stringKey = Buffer.from(exportedKey).toString("base64")
      const encryptedPrivateKey = await encryptPrivateKey(
        req.privateKey,
        stringKey
      )
      res({ success: true, encryptedPrivateKey: encryptedPrivateKey })
    } catch (error) {
      console.error("Error encrypt key:", error)
      res({ success: false, encryptedPrivateKey: "" })
    }
  } else {
    res({ success: false })
  }
})

chrome.runtime.onSuspend.addListener(() => {
  console.log("Browser is closing, clearing session storage")
  chrome.storage.session.clear(() => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    } else {
      console.log("Session storage cleared")
    }
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
  }
})
