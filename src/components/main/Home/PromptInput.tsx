import React, { useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

function PromptInput() {
  const [password, setPassword] = useState<string>("")
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    sendToBackground({
      name: "ping",
      body: {
        action: "checkPassword",
        password: password
      }
    }).then((response) => {
      if (response.success) {
      } else {
      }
    })
  }
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          minWidth: "300px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column"
        }}>
        <form
          className="plasmo-flex plasmo-flex-col plasmo-items-center"
          onSubmit={handleSubmit}>
          <h2 className="plasmo-font-['Inter']">Enter password:</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              margin: "5px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontFamily: "Inter"
            }}
          />
          <button
            onClick={handleSubmit}
            style={{ margin: "5px", backgroundColor: "#0570EB" }}
            className="plasmo-h-10 plasmo-border plasmo-rounded-md plasmo-w-72 ">
            <span className="plasmo-text-white plasmo-text-base plasmo-font-normal plasmo-font-['Inter']">
              Submit
            </span>
          </button>
        </form>

        <button
          style={{ margin: "5px", backgroundColor: "#0570EB" }}
          className="plasmo-h-10 plasmo-border plasmo-rounded-md">
          <span className="plasmo-text-white plasmo-text-base plasmo-font-normal plasmo-font-['Inter']">
            Close
          </span>
        </button>
      </div>
    </div>
  )
}

export default PromptInput
