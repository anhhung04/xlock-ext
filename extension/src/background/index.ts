import generateDeviceId from "~services/deviceID/generate.device.id"
import generateKeyPair from "~services/keyPair/generate.key.pair"
import { deriveKey } from "~services/password/password.hash"

export {}

console.log("background.js is working")

chrome.runtime.onMessageExternal.addListener(async function (req, sender, res) {
  if (req.type === "SEND_TOKEN") {
    if (req.token) {
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
  } else if (req.type === "REQUEST_DEVICE_ID") {
    try {
      const deviceID = generateDeviceId()
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
  } else {
    res({ success: false })
  }
})
