import React, { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import Modal from "~Modal"
import { apiCall } from "~services/api/api"
import { getSessionToken } from "~services/token/get.session.token"

import Account from "./Account/Account"
import Add from "./Add/Add"
import Generate from "./Generate/Generate"
import Home from "./Home/Home"

export default function Main({ loginSuccess }) {
  const [page, setPage] = useState<string>("home")
  const [isExpired, setIsExpired] = useState<boolean>(false)

  function handleSetPage(page: string): void {
    setPage(page)
  }

  function handleHomeSetAdd() {
    setPage("add")
  }

  useEffect(() => {
    const checkTokenExpire = async () => {
      try {
        const token = await getSessionToken()
        const responseData = await apiCall(
          "/api/v1/auth/verify",
          "POST",
          {
            access_token: token
          },
          token
        )
        if (responseData["code"] === 500) {
          setIsExpired(true)
        }
      } catch (error) {
        console.error("An error occured while verifying the token:", error)
      }
    }
    checkTokenExpire()
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
    setIsExpired(false)
  }

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-w-90 plasmo-h-145 plasmo-max-h-145 plasmo-border">
      <div
        className="plasmo-flex plasmo-px-5 plasmo-py-2.5 plasmo-justify-start plasmo-items-center plasmo-bg-white"
        style={{ boxShadow: "0px 1px 15px 0px rgba(0, 0, 0, 0.25)" }}>
        <img
          src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\icon.png"
          width={40}
          height={40}
          className="w-10 h-10 plasmo-mr-3"
        />
        <p
          className="plasmo-inline-block plasmo-text-4xl plasmo-font-normal "
          style={{ fontFamily: "Jockey One", color: "#29428D" }}>
          XLock
        </p>
      </div>
      {page === "home" && (
        <Home loginSuccess={loginSuccess} onAddAccount={handleHomeSetAdd} />
      )}
      {page === "add" && <Add />}
      {page === "generate" && <Generate />}
      {page === "account" && <Account />}
      <div
        className="plasmo-flex plasmo-justify-center plasmo-items-center plasmo-px-5 plasmo-py-2.5 plasmo-w-full plasmo-h-12 plasmo-gap-10"
        style={{
          borderRadius: "12px 12px 0px 0px",
          background: "#FFF",
          boxShadow: "0px -1px 15px 0px rgba(0, 0, 0, 0.25)"
        }}>
        <div
          className=""
          onClick={() => handleSetPage("home")}
          style={{
            backgroundColor: page === "home" ? "#D7F3FD" : "transparent",
            borderRadius: "16px",
            padding: "5px"
          }}>
          <img
            src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\home-icon.png"
            alt="Home"
            width={20}
            height={20}
          />
        </div>
        <div
          className=""
          onClick={() => handleSetPage("add")}
          style={{
            backgroundColor: page === "add" ? "#D7F3FD" : "transparent",
            borderRadius: "16px",
            padding: "5px"
          }}>
          <img
            src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\add-icon.png"
            alt="Add"
            width={20}
            height={20}
          />
        </div>
        <div>
          <img
            src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\icon48.png"
            alt="Logo"
            width={40}
            height={40}
          />
        </div>
        <div
          className=""
          onClick={() => handleSetPage("generate")}
          style={{
            backgroundColor: page === "generate" ? "#D7F3FD" : "transparent",
            borderRadius: "16px",
            padding: "5px"
          }}>
          <img
            src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\generate-icon.png"
            alt="Generate"
            width={20}
            height={20}
          />
        </div>
        <div
          className=""
          onClick={() => handleSetPage("account")}
          style={{
            backgroundColor: page === "account" ? "#D7F3FD" : "transparent",
            borderRadius: "16px",
            padding: "5px"
          }}>
          <img
            src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\account-icon.png"
            alt="Account"
            width={20}
            height={20}
          />
        </div>
      </div>
      <Modal isOpen={isExpired} onConfirm={handleModalConfirm}></Modal>
    </div>
  )
}
