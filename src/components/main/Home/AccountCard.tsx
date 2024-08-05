import React, { useRef, useState } from "react"

import Button from "./Button"

interface Credentials {
  username: string
  password: string
}

interface UserInfo {
  buttonKey: string
  credentialID: string
  credentials: Credentials
}

export default function AccountCard({
  buttonKey,
  credentialID,
  credentials
}: UserInfo) {
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const icon = chrome.runtime.getURL(`assets/copy.svg`)

  function handleCheck() {
    setIsChecked((prev) => !prev)
  }

  function copyToClipboard(value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        console.log("Text copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  return (
    <div
      className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-items-start plasmo-justify-start plasmo-h-56 plasmo-p-4 hover:plasmo-cursor-pointer"
      style={{
        borderRadius: 12,
        border: "1px solid #D1D3D3",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
      }}>
      <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-gap-3">
        <div
          className="plasmo-w-40 plasmo-h-10 plasmo-flex plasmo-flex-col plasmo-justify-center plasmo-px-3 "
          style={{ borderRadius: 12, border: "1px solid #D1D3D3" }}>
          <span
            className="plasmo-text-sm plasmo-font-normal"
            style={{ fontFamily: "Inter" }}>
            {credentialID}
          </span>
        </div>
        <Button label={buttonKey} onCheck={handleCheck} />
      </div>
      <div className="plasmo-flex plasmo-flex-col">
        <p
          className="plasmo-text-sm plasmo-font-medium plasmo-pl-3"
          style={{ fontFamily: "Inter" }}>
          Username
        </p>
        <div
          className="plasmo-flex plasmo-items-center plasmo-h-10 plasmo-pr-[10px]"
          style={{
            borderRadius: 12,
            border: "1px solid #D1D3D3",
            background: "#FFF",
            width: "272px"
          }}>
          <p
            className="plasmo-pl-3 plasmo-test-sm font-normal plasmo-h-3.5"
            style={{ fontFamily: "Inter" }}>
            {isChecked ? credentials.username : "********"}
          </p>
          <button
            className="hover:plasmo-scale-110 transition active:plasmo-scale-90"
            onClick={() => copyToClipboard(credentials.username)}
            style={{
              backgroundImage: `url(${icon})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              width: "20px",
              height: "20px",
              marginLeft: "auto"
            }}></button>
        </div>
      </div>
      <div className="plasmo-flex plasmo-flex-col">
        <p
          className="plasmo-text-sm plasmo-font-medium plasmo-pl-3"
          style={{ fontFamily: "Inter" }}>
          Password
        </p>
        <div
          className="plasmo-flex  plasmo-items-center  plasmo-h-10 plasmo-pr-[10px]"
          style={{
            borderRadius: 12,
            border: "1px solid #D1D3D3",
            background: "#FFF",
            width: "272px"
          }}>
          <p
            className="plasmo-pl-3 plasmo-test-sm font-normal plasmo-h-3.5  "
            style={{ fontFamily: "Inter" }}>
            {"********"}
          </p>
          <button
            className="hover:plasmo-scale-110 transition active:plasmo-scale-90"
            onClick={() => copyToClipboard(credentials.password)}
            style={{
              backgroundImage: `url(${icon})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              width: "20px",
              height: "20px",
              marginLeft: "auto"
            }}></button>
        </div>
      </div>
    </div>
  )
}
