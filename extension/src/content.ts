import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  exclude_matches: ["http://*/*"]
}

console.log("content.js is working")
const token = localStorage.getItem("userToken")
console.log(token)

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
