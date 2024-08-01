import React, { useState } from "react"

import { apiCall } from "~services/api/api"
import { getSessionToken } from "~services/token/get.session.token"

import Modal from "./Modal"

const getURL = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0]
      if (currentTab && currentTab.url) {
        const parsedURL = new URL(currentTab.url)
        const port = parsedURL.port ? `:${parsedURL.port}` : ""
        const mainURL = `${parsedURL.protocol}//${parsedURL.hostname}${port}/`
        resolve(mainURL)
      } else {
        reject("No active tab found or tab URL is missing")
      }
    })
  })
}

export default function Add() {
  const [credentialId, setCredentialId] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name: credentialId,
      url: await getURL(),
      description: "New item information",
      credentials: {
        username: username,
        password: password
      }
    }

    const token = await getSessionToken()

    // const responseData = await apiCall("/api/account/add", "POST", data, token)
    const responseData = await fetch("http://localhost:5000/account", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        credentialID: credentialId,
        credentials: {
          username: username,
          password: password
        }
      })
    })

    console.log(responseData)
    setShowModal(true)
    setCredentialId("")
    setUsername("")
    setPassword("")

    // if (responseData && responseData["code"] === 200) {
    //   console.log("FETCH SUCCESS")
    //   setShowModal(true)
    //   setCredentialId("")
    //   setUsername("")
    //   setPassword("")
    // } else {
    //   console.log("FETCH FAILED")
    // }
  }
  return (
    <div style={{ position: "relative", height: 470.4 }}>
      {showModal && <Modal onClose={() => setShowModal(false)} />}
      <div
        style={{
          height: 472,
          filter: showModal ? "blur(5px)" : "none"
        }}
        className="plasmo-flex plasmo-flex-col plasmo-pt-10 plasmo-items-center">
        <p
          className="plasmo-font-bold plasmo-mb-5"
          style={{ fontSize: "22px", fontFamily: "Inter" }}>
          Create New Account
        </p>
        <form
          id="formAdd"
          onSubmit={handleSubmit}
          className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-5">
          <div
            className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-items-start plasmo-justify-start plasmo-h-60 plasmo-p-4"
            style={{
              borderRadius: 12,
              border: "1px solid #D1D3D3",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
            }}>
            <div className="plasmo-flex plasmo-flex-col">
              <label
                htmlFor="credentialIdField"
                className="plasmo-text-sm plasmo-font-medium plasmo-pl-3"
                style={{ fontFamily: "Inter" }}>
                Credential id
              </label>
              <input
                className="plasmo-flex plasmo-flex-col plasmo-justify-center plasmo-h-10 plasmo-gap-2"
                style={{
                  borderRadius: 12,
                  border: "1px solid #D1D3D3",
                  background: "#FFF",
                  width: "272px",
                  paddingLeft: "10px",
                  fontFamily: "Inter"
                }}
                placeholder="Enter credential id"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
              />
            </div>
            <div className="plasmo-flex plasmo-flex-col">
              <label
                htmlFor="usernameField"
                className="plasmo-text-sm plasmo-font-medium plasmo-pl-3"
                style={{ fontFamily: "Inter" }}>
                Username
              </label>
              <input
                className="plasmo-flex plasmo-flex-col plasmo-justify-center plasmo-h-10 plasmo-gap-2"
                style={{
                  borderRadius: 12,
                  border: "1px solid #D1D3D3",
                  background: "#FFF",
                  width: "272px",
                  paddingLeft: "10px",
                  fontFamily: "Inter"
                }}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="plasmo-flex plasmo-flex-col">
              <label
                htmlFor="passwordField"
                className="plasmo-text-sm plasmo-font-medium plasmo-pl-3"
                style={{ fontFamily: "Inter" }}>
                Password
              </label>
              <input
                className="plasmo-flex plasmo-flex-col plasmo-justify-center plasmo-h-10 plasmo-gap-2"
                style={{
                  borderRadius: 12,
                  border: "1px solid #D1D3D3",
                  background: "#FFF",
                  width: "272px",
                  paddingLeft: "10px",
                  fontFamily: "Inter"
                }}
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="plasmo-h-10 plasmo-border plasmo-rounded-md plasmo-mb-1 "
            style={{ backgroundColor: "#0570EB", width: 310 }}>
            <span
              className="plasmo-text-white plasmo-text-base plasmo-font-semibold"
              style={{ fontFamily: "Inter" }}>
              Save
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
