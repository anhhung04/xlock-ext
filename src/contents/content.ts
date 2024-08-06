import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import type { ItemModel, ShareItemModel } from "~components/types/Item"
import { decryptMessage } from "~services/crypto/decrypt.message"
import { getSessionPassword } from "~services/password/get.session.password"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  exclude_matches: ["http://localhost:*/*"]
}

interface Credentials {
  username: string
  password: string
}

interface AccountCardInfo {
  credentialID: string
  credentials: Credentials
}

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

// step 0: check if current page is login page
function isLoginPage() {
  const loginKeywords = ["login", "signin"]
  const signupKeywords = ["signup", "register", "registration"]

  const url = window.location.href.toLowerCase()

  return (
    loginKeywords.some((keyword) => url.includes(keyword)) ||
    !signupKeywords.some((keyword) => url.includes(keyword))
  )
}

// step 3: append button to each input field
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

// step 4: implement button after append
function createXLockButton(
  inputField: HTMLInputElement,
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

  positionXLockButton(xLockButton, inputField)

  attachPopupToXLockButton(xLockButton, inputField)
  return xLockButton
}

// step 5: change the position of button (already handle case conflict with web reveal)
function positionXLockButton(
  xLockButton: HTMLElement,
  inputField: HTMLInputElement
) {
  let cumulativeHeight = 0
  let currentElement = inputField.previousElementSibling

  while (currentElement) {
    const currentElementRect = currentElement.getBoundingClientRect()
    cumulativeHeight += currentElementRect.height
    currentElement = currentElement.previousElementSibling
  }

  let revealButtonLength = 0
  if (inputField.nextElementSibling) {
    const revealButton = inputField.nextElementSibling.getBoundingClientRect()
    revealButtonLength += revealButton.width
  }

  const rect = inputField.getBoundingClientRect()
  const { top, bottom, left, right } = rect

  const computedStyle = window.getComputedStyle(inputField)
  const paddingRight = parseFloat(computedStyle.paddingRight)
  const parentComputedStyle = window.getComputedStyle(inputField.closest("div"))
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

// step 6b: off / on when click on button to close / open tab
function updatePopup(popup: HTMLElement, xLockButton: HTMLElement) {
  document.body.appendChild(popup)

  xLockButton.addEventListener("click", () => {
    popup.style.display = popup.style.display === "none" ? "flex" : "none"
  })
}

// step 6a: check the condition when fill button appear
function attachPopupToXLockButton(
  xLockButton: HTMLElement,
  inputField: HTMLInputElement
) {
  function removeExistingPopup() {
    const existingPopups = document.querySelectorAll(
      ".popup, .checklogin-popup, .container-button"
    )
    existingPopups.forEach((popup) => popup.remove())
  }

  function checkSession() {
    sendToBackground({
      name: "ping",
      body: {
        action: "getToken"
      }
    }).then((response) => {
      removeExistingPopup()
      if (response.success && response.user_token) {
        const autofillPopup = createAutofillPopup(inputField)
        updatePopup(autofillPopup, xLockButton)
      } else {
        const loginPopup = createLoginPopup(inputField)
        updatePopup(loginPopup, xLockButton)
      }
    })
  }

  checkSession()

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.body.type === "refresh") {
      checkSession()
    }
  })

  inputField.addEventListener("focus", () => {
    xLockButton.style.opacity = "1"

    inputField.addEventListener("mouseover", () => {
      xLockButton.style.opacity = "1"
    })
    inputField.addEventListener("mouseout", () => {
      if (!document.activeElement.isEqualNode(inputField)) {
        xLockButton.style.opacity = "0"
      }
    })
    xLockButton.addEventListener("mouseover", () => {
      xLockButton.style.opacity = "1"
    })
    xLockButton.addEventListener("mouseout", () => {
      if (!document.activeElement.isEqualNode(inputField)) {
        xLockButton.style.opacity = "0"
      }
    })
  })

  inputField.addEventListener("blur", () => {
    if (!inputField.matches(":hover") && !xLockButton.matches(":hover")) {
      xLockButton.style.opacity = "0"
    }
  })
}

// step 7: If user are not login, redirect to web
function createLoginPopup(inputField: HTMLInputElement): HTMLElement {
  const checkLoginPopup = document.createElement("div")
  checkLoginPopup.className = "checklogin-popup"
  Object.assign(checkLoginPopup.style, {
    display: "none",
    position: "fixed",
    backgroundColor: "white",
    zIndex: "1000",
    width: "330px",
    height: "auto",
    top: `${inputField.getBoundingClientRect().bottom + 5}px`,
    left: `${inputField.getBoundingClientRect().left}px`,
    padding: "0px",
    margin: "0px",
    border: "1px solid #ccc",
    flexDirection: "column"
  })

  const popupHeader = createAutofillPopupHeader()
  checkLoginPopup.appendChild(popupHeader)

  const container = document.createElement("div")
  container.className = "container-button"
  Object.assign(container.style, {
    display: "flex",
    padding: "20px",
    flexDirection: "column"
  })
  checkLoginPopup.appendChild(container)

  const title = document.createElement("p")
  title.className = "title-button"
  Object.assign(title.style, {
    fontSize: "15px",
    fontFamily: "Inter",
    marginBottom: "20px",
    fontWeight: 600
  })
  title.textContent = "Log in to XLock to fill credentials"
  container.appendChild(title)

  const loginButton = document.createElement("div")
  loginButton.className = "login-button"
  Object.assign(loginButton.style, {
    display: "flex",
    justifyContent: "center",
    padding: "10px 20px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center",
    userSelect: "none",
    zIndex: 1000,
    backgroundColor: "#0570EB",
    fontFamily: "Inter",
    fontWeight: 600
  })
  loginButton.textContent = "Log in"

  loginButton.addEventListener("click", () => {
    window.open("http://localhost:3000/login", "_blank")
  })

  container.appendChild(loginButton)

  return checkLoginPopup
}

// step 9 : step 7 + step 8
function createAutofillPopup(inputField: HTMLInputElement): HTMLElement {
  const autofillPopup = document.createElement("div")
  autofillPopup.className = "autofill-popup"
  Object.assign(autofillPopup.style, {
    display: "none",
    position: "fixed",
    backgroundColor: "white",
    zIndex: "10000",
    width: "330px",
    height: "auto",
    top: `${inputField.getBoundingClientRect().bottom + 5}px`,
    left: `${inputField.getBoundingClientRect().left}px`,
    padding: "0px",
    margin: "0px",
    border: "1px solid #ccc",
    flexDirection: "column"
  })

  const autofillPopupHeader = createAutofillPopupHeader()
  autofillPopup.appendChild(autofillPopupHeader)

  const accountBody = document.createElement("div")
  accountBody.className = "account-body"
  Object.assign(accountBody.style, {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "10px",
    paddingBottom: "20px",
    gap: "10px"
  })

  autofillPopup.appendChild(accountBody)

  async function fetchAccountCards(accountBody: HTMLElement) {
    accountBody.innerHTML = ""
    sendToBackground({
      name: "ping",
      body: {
        action: "fetchAccountCards"
      }
    }).then((response) => {
      const accountCards = response.data

      if (accountCards.length > 0) {
        const accounts = accountCards.map(
          (card: ItemModel | ShareItemModel) => ({
            description: card.description,
            credentials: card.enc_credentials
          })
        )

        accounts.forEach(
          async (account: { description: string; credentials: string }) => {
            const [initializationVector, salt, cipherText] =
              account.credentials.split("::")

            const password = await getSessionPassword()

            console.log("START DECRYPT")
            // const dec_credentials = await decryptMessage(
            //   { salt, initializationVector, cipherText },
            //   password
            // )
            const dec_credentials = '{"username: Quan, password: 111111"}'
            console.log("END DECRYPT")

            const cardInfo = JSON.parse(dec_credentials)

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

            const accountOptionImage = document.createElement(
              "img"
            ) as HTMLImageElement
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
            accountOptionID.textContent = account.description
            accountOptionID.style.fontFamily = "Inter"
            accountOptionID.style.fontSize = "14px"
            accountOptionID.style.fontWeight = "400"

            const accountOptionUsername = document.createElement("div")
            accountOptionUsername.className = "account-option-username"
            accountOptionUsername.textContent = cardInfo.username
            accountOptionUsername.style.fontFamily = "Inter"
            accountOptionUsername.style.fontSize = "14px"
            accountOptionUsername.style.fontWeight = "400"

            accountOption.addEventListener("click", () => {
              autofillCredentials(cardInfo.username, cardInfo.password)
              autofillPopup.style.display = "none"
            })

            accountOptionInfor.appendChild(accountOptionID)
            accountOptionInfor.appendChild(accountOptionUsername)
            accountOption.appendChild(accountOptionImage)
            accountOption.appendChild(accountOptionInfor)
            accountBody.appendChild(accountOption)
          }
        )
      } else if (accountCards.length === 0) {
        const title = document.createElement("p")
        title.className = "account-body-title"
        Object.assign(title.style, {
          fontWeight: 600,
          fontFamily: "Inter",
          fontSize: "14px",
          zIndex: 1000
        })
        title.textContent = "Doesn't have account yet?"
        accountBody.appendChild(title)

        const addButton = document.createElement("div")
        addButton.className = "add-account-button"
        Object.assign(addButton.style, {
          display: "flex",
          justifyContent: "center",
          padding: "10px 20px",
          fontSize: "16px",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          textAlign: "center",
          userSelect: "none",
          zIndex: 1000,
          backgroundColor: "#0570EB",
          fontFamily: "Inter",
          fontWeight: 600
        })
        addButton.textContent = "Add Account to XLock"

        addButton.addEventListener("click", () => {
          sendToBackground({
            name: "ping",
            body: {
              action: "openPopup"
            }
          }).then(() => console.log("SEND MESSAGE POPUP SUCCESS"))
        })

        accountBody.appendChild(addButton)
      } else {
        console.log("SOME THING WRONG ???")
      }
    })
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.body.type === "refreshFetch") {
      fetchAccountCards(accountBody)
    }
  })

  fetchAccountCards(accountBody)

  return autofillPopup
}

// step 8: create header for popup tab
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

// step 1: Detect input field
const detectInputField = () => {
  if (!isLoginPage()) {
    return
  }

  const usernameFields = document.querySelectorAll(
    'input[type="text"], input[type="email"], input[name="username"]'
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
