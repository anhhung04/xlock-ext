import React, { useEffect, useState } from "react"

import requestSendCredential from "~services/browserCall/request.send.credential"

export default function Add() {
  const [tabURL, setTabURL] = useState<string>("")
  const [tabIcon, setTabIcon] = useState<string>("")
  const [tabTitle, setTabTitle] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  useEffect(() => {
    const fetchTabInfo = async () => {
      const params = new URLSearchParams(window.location.search)
      const url = params.get("tabURL") || ""
      const icon = params.get("tabIcon") || ""
      const title = params.get("tabTitle") || ""

      setTabURL(url)
      setTabTitle(title)

      if (icon) {
        try {
          const response = await fetch(icon)
          const blob = await response.blob()
          const reader = new FileReader()
          reader.onloadend = () => {
            setTabIcon(reader.result as string)
          }
          reader.readAsDataURL(blob)
        } catch (error) {
          console.error("Error loading image:", error)
        }
      }
    }
    fetchTabInfo()
  }, [])

  const handleSave = async () => {
    const credentials = {
      username: username,
      password: password
    }

    const data = {
      name: tabTitle,
      site: tabURL,
      description: description,
      credentials: credentials,
      logo_url: tabIcon
    }

    try {
      await requestSendCredential(data)
      setShowSuccess(true)
      setDescription("")
      setUsername("")
      setPassword("")
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  const handleClose = () => {
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.remove(tab.id!)
    })
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "50px"
      }}>
      <div
        style={{
          width: "360px",
          height: "560px",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "start",
          backgroundColor: "#fcfcfc",
          boxShadow: "0px 1px 15px 0px rgba(0, 0, 0, 0.25)",
          padding: "20px",
          gap: "20px"
        }}>
        <div
          style={{
            display: "flex",
            padding: "20 10 20 10",
            justifyContent: "start",
            alignItems: "center"
          }}>
          <img
            src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\icon.png"
            width={50}
            height={50}
            style={{
              width: "40px",
              height: "40px",
              marginRight: "12px"
            }}
          />
          <p
            style={{
              display: "inline-block",
              fontFamily: "Inter",
              fontSize: 18,
              fontWeight: 600
            }}>
            Add new credential
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: 420,
            gap: 20
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              width: "auto",
              flexShrink: 0,
              gap: "8px"
            }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "40px",
                width: "40px",
                border: "1px solid #D8D8D8",
                borderRadius: "8px",
                alignItems: "center"
              }}>
              <img
                src={tabIcon}
                width={40}
                height={40}
                style={{ width: "30px", height: "30px" }}
                onError={() => console.error("Error loading image:", tabIcon)}
              />
            </div>

            <input
              value={tabTitle}
              style={{
                border: "1px solid #D8D8D8",
                height: "40px",
                width: "270px",
                padding: "0 16px",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 15
              }}></input>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              gap: "4px"
            }}>
            <label
              htmlFor="description"
              style={{ fontSize: 14, fontWeight: 500, color: "#565656" }}>
              Description
            </label>
            <input
              id="description"
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              style={{
                border: "1px solid #D8D8D8",
                borderRadius: 8,
                fontSize: 15,
                height: 40,
                fontFamily: "Inter",
                padding: "0 16px",
                width: 320
              }}></input>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              gap: "4px"
            }}>
            <label
              htmlFor="username"
              style={{ fontSize: 14, fontWeight: 500, color: "#565656" }}>
              Username
            </label>
            <input
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                border: "1px solid #D8D8D8",
                borderRadius: 8,
                fontSize: 15,
                height: 40,
                fontFamily: "Inter",
                padding: "0 16px",
                width: 320
              }}></input>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              gap: "4px"
            }}>
            <label
              htmlFor="password"
              style={{ fontSize: 14, fontWeight: 500, color: "#565656" }}>
              Password
            </label>
            <input
              id="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              style={{
                border: "1px solid #D8D8D8",
                borderRadius: 8,
                fontSize: 15,
                height: 40,
                fontFamily: "Inter",
                padding: "0 16px",
                width: 320
              }}></input>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              gap: "4px"
            }}>
            <label
              htmlFor="address"
              style={{ fontSize: 14, fontWeight: 500, color: "#565656" }}>
              Website Address
            </label>
            <input
              id="address"
              placeholder="Enter address"
              style={{
                border: "1px solid #D8D8D8",
                borderRadius: 8,
                fontSize: 15,
                height: 40,
                fontFamily: "Inter",
                padding: "0 16px",
                width: 320
              }}
              value={tabURL}></input>
          </div>
        </div>

        <div
          style={{
            height: 40,
            width: 320,
            borderTop: "1px solid #D8D8D8",
            padding: 20
          }}>
          <button
            style={{
              width: "100%",
              height: 40,
              borderRadius: 8,
              border: "none",
              backgroundColor: "#0570EB",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 400,
              fontFamily: "Inter",
              color: "white"
            }}
            onClick={handleSave}>
            Save
          </button>
        </div>
        {showSuccess && (
          <div
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              backgroundColor: "#4BB543",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              animation: "slide-in 0.5s forwards"
            }}>
            <span>Save Successfully</span>
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                marginLeft: "10px",
                cursor: "pointer"
              }}
              onClick={handleClose}>
              Close
            </button>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  )
}
