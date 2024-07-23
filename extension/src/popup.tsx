import { useState } from "react"

import Login from "~components/login/login"
import Main from "~components/main/Main"
import { getSalt } from "~services/password/get.salt"
import { authenPassword } from "~services/password/password.authen"
import { authenToken } from "~services/token/auth.token"
import { decryptToken } from "~services/token/decrypt.token"
import { getEncryptedToken } from "~services/token/get.token"

import "~style.css"

function IndexPopup() {
  const [incorrectAttempts, setIncorrectAttempts] = useState(0)
  const [isLogin, setIsLogin] = useState(false)
  const [showResetButton, setShowResetButton] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  function redirectToLogin(callbackURL: string) {
    chrome.windows.create({
      url:
        process.env.FRONTEND_URL +
        `/login?callbackURL=${encodeURIComponent(callbackURL)}`,
      type: "popup",
      width: 500,
      height: 500
    })
  }

  const handleLogin = async (password: string) => {
    try {
      const encryptedToken = await getEncryptedToken()
      const salt = await getSalt()
      const decryptedToken = decryptToken(encryptedToken, password, salt)
      const responseToken = authenToken((await decryptedToken).toString())

      if (responseToken["code"] === 401) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0]
          const callbackURL = currentTab.url
          redirectToLogin(callbackURL)
        })
      }

      const responseData = await authenPassword("/api/auth/login", {
        Password: password
      })

      const isSuccess = responseData && responseData["code"] === 200
      if (isSuccess) {
        setIncorrectAttempts(0)
        setIsLogin(true)
        setLoginSuccess(true)
      } else {
        setIncorrectAttempts((prev) => prev + 1)
        if (incorrectAttempts + 1 >= 5) {
          setShowResetButton(true)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleResetPassword = () => {
    window.open(process.env.PLASMO_PUBLIC_FRONTEND_URL + "/login")
  }

  if (isLogin) {
    return <Main loginSuccess={loginSuccess} />
  }

  return (
    <Login
      onLogin={handleLogin}
      incorrectAttempts={incorrectAttempts}
      showResetButton={showResetButton}
      onResetPassword={handleResetPassword}
    />
  )
}

export default IndexPopup
