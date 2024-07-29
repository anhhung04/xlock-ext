import { parse } from "path"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  exclude_matches: ["http://localhost:*/*"]
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

function isLoginPage() {
  const loginKeywords = ["login", "signin"]
  const signupKeywords = ["signup", "register", "registration"]

  const url = window.location.href.toLowerCase()

  return (
    loginKeywords.some((keyword) => url.includes(keyword)) ||
    !signupKeywords.some((keyword) => url.includes(keyword))
  )
}

const detectPasswordField = () => {
  if (!isLoginPage()) {
    return
  }

  const passwordFields = document.querySelectorAll('input[type="password"]')

  passwordFields.forEach((passwordField) => {
    const parentDiv = passwordField.closest("div")
    if (parentDiv) {
      passwordField.setAttribute("data_x_lock_id", "password_field_by_xlock")
      parentDiv.style.position = "relative"

      const xLockButton = document.createElement("x-lock")
      xLockButton.setAttribute("aria-label", "Open xlock popup")
      xLockButton.setAttribute("role", "button")

      xLockButton.id = "password_field_by_xlock"

      const imageURL = chrome.runtime.getURL("assets/icon.png")
      xLockButton.style.backgroundImage = `url("${imageURL}")`
      xLockButton.style.backgroundSize = "24px 24px"
      xLockButton.style.cursor = "pointer"
      xLockButton.style.width = "24px"
      xLockButton.style.position = "absolute"
      xLockButton.style.opacity = "0"
      xLockButton.style.marginTop = "auto"
      xLockButton.style.minWidth = "24px"
      xLockButton.style.zIndex = "1"
      xLockButton.style.padding = "0"
      xLockButton.style.height = "24px"
      xLockButton.style.backgroundRepeat = "no-repeat"

      let cumulativeHeight = 0
      let currentElement = passwordField.previousElementSibling

      while (currentElement) {
        const currentElementRect = currentElement.getBoundingClientRect()
        cumulativeHeight += currentElementRect.height
        currentElement = currentElement.previousElementSibling
      }

      const rect = passwordField.getBoundingClientRect()
      const top = rect.top
      const bottom = rect.bottom
      const left = rect.left
      const right = rect.right

      // console.log("TOP:::", top)
      // console.log("bottom:::", bottom)
      // console.log("left:::", left)
      // console.log("right:::", right)

      const computedStyleWidth = window.getComputedStyle(passwordField)
      const paddingRight = parseFloat(computedStyleWidth.paddingRight)
      const computedStyleHeight = window.getComputedStyle(parentDiv)
      const paddingTop = parseFloat(computedStyleHeight.paddingTop)
      const padRight = parseFloat(computedStyleHeight.paddingRight)
      const borderRightWidth = parseFloat(computedStyleHeight.borderRightWidth)
      const borderTopWidth = parseFloat(computedStyleHeight.borderTopWidth)
      const borderLeftWidth = parseFloat(computedStyleHeight.borderLeftWidth)

      xLockButton.style.top = `${paddingTop + borderTopWidth + cumulativeHeight + (bottom - top) / 2 - 12}px`
      xLockButton.style.left = `${right - paddingRight - borderRightWidth + padRight - 24 - left - borderLeftWidth}px`

      passwordField.addEventListener("focus", () => {
        xLockButton.style.opacity = "1"
      })

      passwordField.addEventListener("blur", () => {
        passwordField.addEventListener("mouseover", () => {
          xLockButton.style.opacity = "1"
        })

        passwordField.addEventListener("mouseout", () => {
          xLockButton.style.opacity = "0"
        })

        xLockButton.addEventListener("mouseover", () => {
          xLockButton.style.opacity = "1"
        })

        xLockButton.addEventListener("mouseout", () => {
          xLockButton.style.opacity = "0"
        })
      })

      parentDiv.appendChild(xLockButton)
      console.log("Parent <div> containing password field detected:", parentDiv)
    }
  })
}

detectPasswordField()
