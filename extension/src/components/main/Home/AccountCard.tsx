import React, { useState } from "react"

import { sendToContentScript } from "@plasmohq/messaging"

import Button from "./Button"

interface UserInfo {
  buttonKey: string
  credentialID: string
  username: string
  password: string
}

interface Message {
  name: string
  password: string
}

export default function AccountCard({
  buttonKey,
  credentialID,
  username,
  password
}: UserInfo) {
  const [isChecked, setIsChecked] = useState<boolean>(false)

  function handleCheck(isChecked: boolean): void {
    setIsChecked(isChecked)
  }

  const handleClick = async () => {
    console.log("Sending message:", {
      type: "AUTOFILL_CREDENTIALS",
      username,
      password
    })

    const message: Message = {
      name: username,
      password: password
    }

    const response = await sendToContentScript(message)

    console.log("RESPONSE FROM CONTENT:", response)
  }

  return (
    <div
      onClick={handleClick}
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
          className="plasmo-flex plasmo-flex-col plasmo-justify-center plasmo-h-10 plasmo-gap-2"
          style={{
            borderRadius: 12,
            border: "1px solid #D1D3D3",
            background: "#FFF",
            width: "272px"
          }}>
          <p
            className="plasmo-pl-3 plasmo-test-sm font-normal plasmo-h-3.5"
            style={{ fontFamily: "Inter" }}>
            {isChecked ? username : "********"}
          </p>
        </div>
      </div>
      <div className="plasmo-flex plasmo-flex-col">
        <p
          className="plasmo-text-sm plasmo-font-medium plasmo-pl-3"
          style={{ fontFamily: "Inter" }}>
          Password
        </p>
        <div
          className="plasmo-flex plasmo-flex-col plasmo-justify-center plasmo-items-start plasmo-h-10 plasmo-gap-2"
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
        </div>
      </div>
    </div>
  )
}
