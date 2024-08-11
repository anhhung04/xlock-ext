import { useEffect, useState } from "react"

import Login from "~components/login/login"
import Main from "~components/main/Main"

import "~style.css"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

import Modal from "~Modal"
import { CryptoService } from "~services/crypto.service"
import { PasswordService } from "~services/password.service"
import { TokenService } from "~services/token.service"

function IndexPopup() {
  const [isLogin, setIsLogin] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const fetchLocalToken = async () => {
      try {
        const tokenResponse = await TokenService.getFromLocal()
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
        const tokenResponse = await TokenService.getFromSession()
        const passwordResponse = await PasswordService.getFromSession()
        if (tokenResponse && passwordResponse) {
          setLoginSuccess(true)
          setIsLogin(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchSession()
  }, [])

  const handleLoginRedirect = async () => {
    await sendToBackground({
      name: "ping",
      body: {
        action: "redirectURL",
        url: process.env.PLASMO_PUBLIC_FRONTEND_URL + "/login"
      }
    })
  }

  const handleModalConfirm = () => {
    handleLoginRedirect()
    setShowModal(false)
  }

  const handleLogin = async (password: string) => {
    try {
      const encryptedToken = await TokenService.getFromLocal()
      const [initializationVector, salt, cipherText] =
        encryptedToken.split("::")
      const vault = {
        salt,
        initializationVector,
        cipherText
      }

      const decryptedToken = await CryptoService.decryptMessage(vault, password)
      const responseToken = await TokenService.verifyToken(decryptedToken)

      if (responseToken["code"] === 200 && responseToken) {
        TokenService.saveToSession(decryptedToken)
        PasswordService.saveToSession(password)
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
      setErrorMessage("Incorrect password. Please try again")
    }
  }

  if (isLogin) {
    return <Main loginSuccess={loginSuccess} />
  }

  return (
    <>
      <Login onLogin={handleLogin} errorMessage={errorMessage} />
      <Modal isOpen={showModal} onConfirm={handleModalConfirm} />
    </>
  )
}

export default IndexPopup
