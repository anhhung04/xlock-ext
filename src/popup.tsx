import { useEffect, useState } from "react"

import Login from "~components/login/login"
import Main from "~components/main/Main"
import { authenToken } from "~services/token/auth.token"
import { getEncryptedToken } from "~services/token/get.local.token"
import { getSessionToken } from "~services/token/get.session.token"

import "~style.css"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

import Modal from "~Modal"
import { decryptMessage } from "~services/crypto/decrypt.message"
import { getTokenVector } from "~services/initializationVector/get.token.vector"
import { getSessionPassword } from "~services/password/get.session.password"
import { saveSessionPassword } from "~services/password/save.session.password"
import { getSaltToken } from "~services/token/get.salt"
import { saveSessionToken } from "~services/token/save.session.token"

function IndexPopup() {
  const [isLogin, setIsLogin] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchLocalToken = async () => {
      try {
        const tokenResponse = await getEncryptedToken()
        if (tokenResponse === "") {
          sendToBackground({
            name: "ping",
            body: {
              action: "redirectURL",
              url: process.env.PLASMO_PUBLIC_FRONTEND_URL
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchLocalToken()
  }, [])

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const tokenResponse = await getSessionToken()
        const passwordResponse = await getSessionPassword()
        if (tokenResponse && passwordResponse) {
          setLoginSuccess(true)
          setIsLogin(true)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchSession()
  }, [])

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleLoginRedirect = () => {
    window.location.href = "http://localhost:3000/login"
  }

  const handleLogin = async (password: string) => {
    try {
      const encryptedToken = await getEncryptedToken()
      const saltToken = await getSaltToken()
      const tokenVector = await getTokenVector()

      const vault = {
        salt: saltToken,
        initializationVector: tokenVector,
        cipherText: encryptedToken
      }

      const decryptedToken = await decryptMessage(vault, password)
      const responseToken = await authenToken(decryptedToken)

      if (responseToken["code"] === 200 && responseToken) {
        saveSessionToken(decryptedToken)
        saveSessionPassword(password)
        sendToContentScript({
          name: "content",
          body: { type: "refresh" }
        })
        setIsLogin(true)
        setLoginSuccess(true)
      } else if (responseToken["code"] === 422) {
        setShowModal(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (isLogin) {
    return <Main loginSuccess={loginSuccess} />
  }

  return <Login onLogin={handleLogin} />
}

export default IndexPopup
