import React, { useState } from "react"

import { apiCall } from "~services/api/api"
import { getSessionToken } from "~services/token/get.session.token"

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
  const [credentialId, setCredentialId] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name: username,
      url: await getURL(),
      description: "New item information",
      credentials: credentialId
    }

    const token = await getSessionToken()

    const responseData = await apiCall("/api/account/add", "POST", data, token)

    console.log(responseData)

    if (responseData && responseData["code"] === 200) {
      console.log("FETCH SUCCESS")
    } else {
      console.log("FETCH FAILED")
    }
  }
  return (
    <div
      style={{ height: 472 }}
      className="plasmo-flex plasmo-flex-col plasmo-pt-10 plasmo-items-center">
      <p
        className=" plasmo-font-bold plasmo-mb-5"
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
          className="plasmo-h-10 plasmo-border plasmo-rounded-md plasmo-mb-1"
          style={{ backgroundColor: "#0570EB", width: 310 }}>
          <span
            className="plasmo-text-white plasmo-text-base plasmo-font-semibold"
            style={{ fontFamily: "Inter" }}>
            Add
          </span>
        </button>
      </form>
    </div>
  )
}
