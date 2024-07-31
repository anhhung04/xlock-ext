import { request } from "http"
import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

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

function attachXLockButton(
  inputField: HTMLInputElement,
  type: "username" | "password"
) {
  const parentDiv = inputField.closest("div")
  if (!parentDiv) {
    return
  }

  inputField.setAttribute("data_x_lock_id", `${type}_field_by_xlock`)
  parentDiv.style.position = "relative"

  const xLockButton = createXLockButton(inputField, `${type}_field_by_xlock`)
  parentDiv.appendChild(xLockButton)
}

function createXLockButton(
  passwordField: HTMLInputElement,
  id: string
): HTMLElement {
  const xLockButton = document.createElement("x-lock")
  xLockButton.setAttribute("aria-label", "Open xlock popup")
  xLockButton.setAttribute("role", "button")
  xLockButton.id = id

  const imageURL = chrome.runtime.getURL("assets/icon.png")
  Object.assign(xLockButton.style, {
    backgroundImage: `url("${imageURL}")`,
    backgroundSize: "24px 24px",
    cursor: "pointer",
    width: "24px",
    position: "absolute",
    opacity: "0",
    marginTop: "auto",
    minWidth: "24px",
    zIndex: "1",
    padding: "0",
    height: "24px",
    backgroundRepeat: "no-repeat"
  })

  positionXLockButton(xLockButton, passwordField)

  attachPopupToXLockButton(xLockButton, passwordField)
  return xLockButton
}

function positionXLockButton(
  xLockButton: HTMLElement,
  passwordField: HTMLInputElement
) {
  let cumulativeHeight = 0
  let currentElement = passwordField.previousElementSibling

  while (currentElement) {
    const currentElementRect = currentElement.getBoundingClientRect()
    cumulativeHeight += currentElementRect.height
    currentElement = currentElement.previousElementSibling
  }

  let revealButtonLength = 0
  if (passwordField.nextElementSibling) {
    const revealButton =
      passwordField.nextElementSibling.getBoundingClientRect()
    revealButtonLength += revealButton.width
  }

  const rect = passwordField.getBoundingClientRect()
  const { top, bottom, left, right } = rect

  const computedStyle = window.getComputedStyle(passwordField)
  const paddingRight = parseFloat(computedStyle.paddingRight)
  const parentComputedStyle = window.getComputedStyle(
    passwordField.closest("div")
  )
  const paddingTop = parseFloat(parentComputedStyle.paddingTop)
  const padRight = parseFloat(parentComputedStyle.paddingRight)
  const borderRightWidth = parseFloat(parentComputedStyle.borderRightWidth)
  const borderTopWidth = parseFloat(parentComputedStyle.borderTopWidth)
  const borderLeftWidth = parseFloat(parentComputedStyle.borderLeftWidth)

  Object.assign(xLockButton.style, {
    top: `${paddingTop + borderTopWidth + cumulativeHeight + (bottom - top) / 2 - 12}px`,
    left: `${right - paddingRight - borderRightWidth + padRight - 24 - left - borderLeftWidth - revealButtonLength}px`
  })
}

function attachPopupToXLockButton(
  xLockButton: HTMLElement,
  inputField: HTMLInputElement
) {
  const autofillPopup = createAutofillPopup(inputField)
  document.body.appendChild(autofillPopup)

  inputField.addEventListener("focus", () => {
    xLockButton.style.opacity = "1"
  })

  inputField.addEventListener("blur", () => {
    inputField.addEventListener("mouseover", () => {
      xLockButton.style.opacity = "1"
    })
    inputField.addEventListener("mouseout", () => {
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
    autofillPopup.style.display =
      autofillPopup.style.display === "none" ? "flex" : "none"
  })
}

function createAutofillPopup(passwordField: HTMLInputElement): HTMLElement {
  const autofillPopup = document.createElement("div")
  autofillPopup.className = "autofill-popup"
  Object.assign(autofillPopup.style, {
    display: "none",
    position: "fixed",
    backgroundColor: "white",
    zIndex: "1000",
    width: "330px",
    height: "auto",
    top: `${passwordField.getBoundingClientRect().bottom + 5}px`,
    left: `${passwordField.getBoundingClientRect().left}px`,
    padding: "0px",
    margin: "0px",
    border: "1px solid #ccc",
    flexDirection: "column"
  })

  const autofillPopupHeader = createAutofillPopupHeader()
  autofillPopup.appendChild(autofillPopupHeader)

  const accounts = [
    {
      name: "Facebook",
      username: "user1",
      password: "password1"
    },
    {
      name: "Google",
      username: "user2",
      password: "password2"
    }
  ]

  const accountBody = document.createElement("div")
  accountBody.className = "account-body"
  Object.assign(accountBody.style, {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "20px",
    paddingBottom: "20px",
    gap: "10px"
  })

  autofillPopup.appendChild(accountBody)

  accounts.forEach((account) => {
    const accountOption = document.createElement("div")
    accountOption.className = "account-option"
    Object.assign(accountOption.style, {
      display: "flex",
      gap: "10px",
      border: "1px solid #000",
      borderRadius: "14px",
      height: "50px",
      alignItems: "center",
      paddingLeft: "10px",
      paddingRight: "10px"
    })

    const accountOptionImage = document.createElement("img") as HTMLImageElement
    accountOptionImage.className = "account-image"
    accountOptionImage.width = 40
    accountOptionImage.height = 40

    sendToBackground({
      name: "ping",
      body: {
        action: "getTabIcon"
      }
    }).then((response) => {
      accountOptionImage.src = response.iconUrl
    })

    const accountOptionInfor = document.createElement("div")
    accountOptionInfor.className = "account-info"
    accountOptionInfor.style.display = "flex"
    accountOptionInfor.style.flexDirection = "column"

    const accountOptionID = document.createElement("div")
    accountOptionID.className = "account-option-ID"
    accountOptionID.textContent = account.name
    accountOptionID.style.fontFamily = "Inter"
    accountOptionID.style.fontSize = "14px"
    accountOptionID.style.fontWeight = "400"

    const accountOptionUsername = document.createElement("div")
    accountOptionUsername.className = "account-option-username"
    accountOptionUsername.textContent = account.username
    accountOptionUsername.style.fontFamily = "Inter"
    accountOptionUsername.style.fontSize = "14px"
    accountOptionUsername.style.fontWeight = "400"

    accountOption.addEventListener("click", () => {
      autofillCredentials(account.username, account.password)
      autofillPopup.style.display = "none"
    })

    accountOptionInfor.appendChild(accountOptionID)
    accountOptionInfor.appendChild(accountOptionUsername)
    accountOption.appendChild(accountOptionImage)
    accountOption.appendChild(accountOptionInfor)
    accountBody.appendChild(accountOption)
  })

  return autofillPopup
}

function createAutofillPopupHeader(): HTMLElement {
  const autofillPopupHeader = document.createElement("div")
  autofillPopupHeader.className = "autofill-popup-header"
  Object.assign(autofillPopupHeader.style, {
    display: "flex",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "10px",
    paddingBottom: "10px",
    justifyContent: "start",
    alignItems: "center",
    backgroundColor: "white",
    boxShadow: "0px 1px 15px 0px rgba(0, 0, 0, 0.1)"
  })

  const image = document.createElement("img") as HTMLImageElement
  image.src = chrome.runtime.getURL("assets/icon.png")
  image.width = 40
  image.height = 40
  Object.assign(image.style, {
    width: "40px",
    height: "40px",
    marginRight: "12px",
    zIndex: "1001"
  })

  const paragraph = document.createElement("p") as HTMLParagraphElement
  Object.assign(paragraph.style, {
    display: "inline-block",
    fontSize: "36px",
    lineHeight: "40px",
    fontWeight: "400",
    fontFamily: "Jockey One",
    color: "#29428D",
    zIndex: "1001"
  })
  paragraph.textContent = "XLock"

  autofillPopupHeader.appendChild(image)
  autofillPopupHeader.appendChild(paragraph)
  return autofillPopupHeader
}

const detectInputField = () => {
  if (!isLoginPage()) {
    return
  }

  const usernameFields = document.querySelectorAll(
    'input[type="text"], input[type="email"]'
  )
  const passwordFields = document.querySelectorAll('input[type="password"]')
  usernameFields.forEach((inputField) =>
    attachXLockButton(inputField as HTMLInputElement, "username")
  )
  passwordFields.forEach((inputField) =>
    attachXLockButton(inputField as HTMLInputElement, "password")
  )
}

detectInputField()
