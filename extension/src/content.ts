import type { PlasmoCSConfig } from "plasmo"

import { setInitialzationVector } from "~services/initializationVector/set.vector"
import { saveSalt } from "~services/password/save.salt"
import { decryptToken } from "~services/token/decrypt.token"
import { encryptToken } from "~services/token/encrypt.token"
import { saveToken } from "~services/token/save.local.token"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  exclude_matches: ["http://*/*"]
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  autofillCredentials(message.name, message.password)

  sendResponse({ success: true, data: "Message handled successfully" })
  return true
})

function autofillCredentials(username: string, password: string) {
  const usernameField = document.querySelector(
    'input[type="text"], input[type="email"]'
  )
  const passwordField = document.querySelector('input[type="password"]')
  if (usernameField && usernameField instanceof HTMLInputElement) {
    usernameField.value = username
  }

  if (passwordField && passwordField instanceof HTMLInputElement) {
    passwordField.value = password
  }
}

const password = "111111"
const access_token = "toighetbachkhoa"
