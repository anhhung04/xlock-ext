import { useEffect, useState } from "react"

import Login from "~components/login/login"
import Main from "~components/main/Main"
import { getSalt } from "~services/password/get.salt"
import { authenPassword } from "~services/password/password.authen"
import { deriveKey } from "~services/password/password.hash"
import { authenToken } from "~services/token/auth.token"
import { decryptToken } from "~services/token/decrypt.token"
import { getEncryptedToken } from "~services/token/get.local.token"
import { getSessionToken } from "~services/token/get.session.token"

import "~style.css"

import Signup from "~components/signup/Signup"
import { getInitializationVector } from "~services/initializationVector/get.vector"
import { cryptoKeyToBase64 } from "~services/password/cryptoKey.to.base64"
import { saveSessionToken } from "~services/token/save.session.token"

function IndexPopup() {
  const [incorrectAttempts, setIncorrectAttempts] = useState(0)
  const [isLogin, setIsLogin] = useState(false)
  const [showResetButton, setShowResetButton] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    const fetchLocalToken = async () => {
      try {
        const tokenResponse = await getEncryptedToken()
        if (tokenResponse) {
          console.log(tokenResponse)
        } else {
          return <Signup />
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchLocalToken()
  }, [])

  useEffect(() => {
    const fetchSessionToken = async () => {
      try {
        const tokenResponse = await getSessionToken()
        if (tokenResponse) {
          console.log(tokenResponse)
          setLoginSuccess(true)
          setIsLogin(true)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchSessionToken()
  }, [])

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
      const initializationVector = await getInitializationVector()

      const { key: passwordHash } = await deriveKey(password, salt)
      const vault = {
        salt,
        initializationVector,
        cipherText: encryptedToken
      }
      const decryptedToken = await decryptToken(vault, password)
      const responseToken = await authenToken(decryptedToken)

      if (responseToken["code"] === 401) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0]
          const callbackURL = currentTab.url
          redirectToLogin(callbackURL)
        })
      }

      const base64Password = await cryptoKeyToBase64(passwordHash)

      const responseData = await authenPassword("/api/auth/login", {
        password: base64Password,
        decryptedToken: decryptedToken
      })

      const isSuccess = responseData && responseData["code"] === 200
      if (isSuccess) {
        await saveSessionToken(decryptedToken)
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
