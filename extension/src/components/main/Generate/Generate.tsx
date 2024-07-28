import React, { useState } from "react"

export default function Generate() {
  const [generatedPassword, setGeneratedPassword] = useState<string>("")

  const generateKey = () => {
    const length = Math.floor(Math.random() * (20 - 15 + 1)) + 15
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
    let password = ""

    while (
      !(
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*()]/.test(password)
      )
    ) {
      password = Array(length)
        .fill(charset)
        .map((x) => x[Math.floor(Math.random() * x.length)])
        .join("")
    }

    return password
  }

  const fillPasswordIntoSignup = (password: string) => {
    const passwordField = document.getElementById("passwordField")
    const confirmPasswordField = document.getElementById("confirmPasswordField")

    if (
      passwordField &&
      passwordField instanceof HTMLInputElement &&
      confirmPasswordField &&
      confirmPasswordField instanceof HTMLInputElement
    ) {
      passwordField.value = password
      confirmPasswordField.value = password
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const password = generateKey()
    setGeneratedPassword(password)
    fillPasswordIntoSignup(password)
  }
  return (
    <div
      style={{ height: 472 }}
      className="plasmo-flex plasmo-flex-col plasmo-pt-10 plasmo-items-center">
      <p
        className=" plasmo-font-bold plasmo-mb-5"
        style={{ fontSize: "22px", fontFamily: "Inter" }}>
        Generate new key
      </p>
      <form
        id="formAdd"
        onSubmit={handleSubmit}
        className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-5">
        <div
          className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-items-start plasmo-justify-start plasmo-h-40 plasmo-p-4"
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
            />
          </div>
        </div>

        <div
          className="plasmo-flex plasmo-justify-start plasmo-items-center plasmo-p-2 plasmo-px-4 plasmo-gap-2"
          style={{
            borderRadius: "6px",
            border: "1px solid #0570EB",
            background: "#E6F1FD",
            width: 310
          }}>
          <div style={{ height: 34 }}>
            <img
              src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\warning.png"
              alt="warning"
            />
          </div>
          <p className="plasmo-w-3/4" style={{ fontSize: 14, fontWeight: 400 }}>
            This key is unique and must not be shared with anyone else
          </p>
        </div>

        <button
          type="submit"
          className="plasmo-h-10 plasmo-border plasmo-rounded-md plasmo-mb-1"
          style={{ backgroundColor: "#0570EB", width: 310 }}>
          <span
            className="plasmo-text-white plasmo-text-base plasmo-font-semibold"
            style={{ fontFamily: "Inter" }}>
            Generate
          </span>
        </button>
      </form>
      {generatedPassword && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #D1D3D3",
            borderRadius: "6px",
            backgroundColor: "#F8F9FA"
          }}>
          <p>Generated Password: {generatedPassword}</p>
        </div>
      )}
    </div>
  )
}
