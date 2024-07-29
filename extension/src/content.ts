import { parse } from "path"
import type { PlasmoCSConfig } from "plasmo"
import { createElement } from "react"

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

      const autofillPopup = document.createElement("div")
      autofillPopup.className = "autofill-popup"
      autofillPopup.style.top = `${bottom + 5}px`
      autofillPopup.style.left = `${left}px`
      autofillPopup.style.display = "none"
      autofillPopup.style.position = "fixed"
      autofillPopup.style.backgroundColor = "white"
      autofillPopup.style.zIndex = "1000"
      autofillPopup.style.width = "330px"
      autofillPopup.style.height = "192px"
      autofillPopup.style.transform = "none"
      autofillPopup.style.padding = "0px"
      autofillPopup.style.margin = "0px"
      autofillPopup.style.clipPath = "none"
      autofillPopup.style.clip = "auto"
      autofillPopup.style.mask = "none"
      autofillPopup.style.colorScheme = "normal"
      autofillPopup.style.border = "1px solid #ccc"
      autofillPopup.style.boxShadow = "0 2px 2px 5px rbga(0,0,0,0.2)"
      autofillPopup.style.flexDirection = "column"

      const autofillPopupHeader = document.createElement("div")
      autofillPopupHeader.className = "autofill-popup-header"
      autofillPopupHeader.style.display = "flex"
      autofillPopupHeader.style.paddingLeft = "20"
      autofillPopupHeader.style.paddingRight = "20"
      autofillPopupHeader.style.paddingTop = "10"
      autofillPopupHeader.style.paddingBottom = "10"
      autofillPopupHeader.style.justifyContent = "start"
      autofillPopupHeader.style.alignItems = "center"
      autofillPopupHeader.style.backgroundColor = "white"
      autofillPopupHeader.style.boxShadow =
        "0px 1px 15px 0px rgba(0, 0, 0, 0.25)"

      const image = document.createElement("img") as HTMLImageElement
      image.src = chrome.runtime.getURL("assets/icon.png")
      image.width = 40
      image.height = 40
      image.style.width = "40px"
      image.style.height = "40px"
      image.style.marginRight = "12px"
      image.style.zIndex = "1001"

      const paragraph = document.createElement("p") as HTMLParagraphElement
      paragraph.style.display = "inline-block"
      paragraph.style.fontSize = "36px"
      paragraph.style.lineHeight = "40px"
      paragraph.style.fontWeight = "400"
      paragraph.style.fontFamily = "Jockey One"
      paragraph.style.color = "#29428D"
      paragraph.style.zIndex = "1001"
      paragraph.textContent = "XLock"

      autofillPopupHeader.appendChild(image)
      autofillPopupHeader.appendChild(paragraph)
      autofillPopup.appendChild(autofillPopupHeader)

      const accounts = [
        { username: "user1@example.com", password: "password1" },
        { username: "user2@example.com", password: "password2" }
      ]

      accounts.forEach((account) => {
        const accountOption = document.createElement("div")
        accountOption.className = "account-option"
        accountOption.textContent = account.username
        accountOption.addEventListener("click", () => {
          ;(passwordField as HTMLInputElement).value = account.password
          autofillPopup.style.display = "none"
        })
        autofillPopup.appendChild(accountOption)
      })

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

      xLockButton.addEventListener("click", () => {
        if (autofillPopup.style.display === "none") {
          autofillPopup.style.display = "flex"
          if (!document.body.contains(autofillPopup)) {
            document.body.appendChild(autofillPopup)
          }
        } else {
          autofillPopup.style.display = "none"
          if (document.body.contains(autofillPopup)) {
            document.body.removeChild(autofillPopup)
          }
        }
      })

      parentDiv.appendChild(xLockButton)
      console.log("Parent <div> containing password field detected:", parentDiv)
    }
  })
}

detectPasswordField()
