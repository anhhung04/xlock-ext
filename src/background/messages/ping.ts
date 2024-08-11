import { sendToContentScript } from "@plasmohq/messaging"

import type { ItemModel, ShareItemModel } from "~components/types/Item"
import { CryptoService } from "~services/crypto.service"
import { apiCall } from "~utils/api"

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
  if (request.body.action === "setSessionToken") {
    chrome.storage.session.set({ user_token: request.body.user_token }, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError })
      } else {
        sendResponse({ success: true })
      }
    })
    return true
  } else if (request.body.action === "getSessionToken") {
    chrome.storage.session.get("user_token", (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError })
      } else {
        sendResponse({ success: true, user_token: result.user_token || "" })
      }
    })
    return true
  } else if (request.body.action === "getLocalToken") {
    chrome.storage.local.get("enc_token", (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, enc_token: "" })
      } else {
        sendResponse({ success: true, enc_token: result.enc_token || "" })
      }
      return true
    })
  } else if (request.body.action === "setLocalToken") {
    chrome.storage.local.set({ user_token: request.body.user_token }, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError })
      } else {
        sendResponse({ success: true })
      }
    })
    return true
  } else if (request.body.action === "getLocalDeviceID") {
    chrome.storage.local.get("device_id", (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, deviceID: "" })
      } else {
        sendResponse({ success: true, deviceID: result.deviceID })
      }
      return true
    })
  } else if (request.body.action === "setLocalDeviceID") {
    chrome.storage.local.set({ device_id: request.body.device_id }, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError })
      } else {
        sendResponse({ success: true })
      }
    })
    return true
  } else if (request.body.action === "getTabIcon") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].favIconUrl) {
        sendResponse({ iconUrl: tabs[0].favIconUrl })
      } else {
        sendResponse({ iconUrl: null })
      }
    })
    return true
  } else if (request.body.action === "getTabInfo") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0]
      if (currentTab && currentTab.url) {
        const parsedURL = new URL(currentTab.url)
        const port = parsedURL.port ? `:${parsedURL.port}` : ""
        const mainURL = `${parsedURL.protocol}//${parsedURL.hostname}${port}`
        sendResponse({
          tabTitle: currentTab.title,
          tabURL: mainURL,
          tabIcon: currentTab.favIconUrl
        })
      } else {
        sendResponse({ error: "Can't find tab" })
      }
    })
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
        const listAccountCards: (ItemModel | ShareItemModel)[] =
          responseData.data
        sendResponse({ success: true, data: listAccountCards })
      }
    })
    return true
  } else if (request.body.action === "openPopup") {
    chrome.tabs.create({
      url: chrome.runtime.getURL(
        `tabs/Add.html?tabTitle=${request.body.tabTitle}&tabURL=${request.body.tabURL}&tabIcon=${request.body.tabIcon}`
      )
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
  } else if (request.body.action === "sendData") {
    try {
      if (request.body.data) {
        const getSessionData = (key: string): Promise<string> => {
          return new Promise((resolve, reject) => {
            chrome.storage.session.get(key, (result) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
              } else {
                resolve(result[key])
              }
            })
          })
        }

        const password: string = await getSessionData("password")
        const token: string = await getSessionData("user_token")

        const raw_credentials = request.body.data.credentials
        const { salt, initializationVector, cipherText } =
          await CryptoService.encryptMessage(
            JSON.stringify(raw_credentials),
            password
          )
        const enc_credentials = CryptoService.concatenateData(
          cipherText,
          initializationVector,
          salt
        )

        const data = {
          name: request.body.data.name,
          site: request.body.data.site,
          description: request.body.data.description,
          enc_credentials: enc_credentials,
          logo_url: request.body.data.logo_url
        }

        const responseData = await apiCall(
          "/api/v1/items/create",
          "POST",
          data,
          token
        )

        if (responseData["code"] === 201) {
          sendToContentScript({
            name: "content",
            body: { type: "refreshFetch" }
          })

          sendResponse({ success: true })
        } else {
          sendResponse({ success: false })
        }
      } else {
        sendResponse({ success: false })
      }
    } catch (error) {
      console.error(error)
      sendResponse({ success: false })
    }
    return true
  } else if (request.body.action === "getEncryptedPrivateKey") {
    chrome.storage.local.get("enc_pri", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting token:", chrome.runtime.lastError)
        sendResponse({ success: false, error: chrome.runtime.lastError })
      } else {
        sendResponse({ success: true, enc_pri: result.enc_pri || "" })
      }
    })
    return true
  }
})
