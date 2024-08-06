import React, { useState } from "react"

interface LoginProps {
  onLogin: (password: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(password)
  }

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-w-90 plasmo-h-145 plasmo-p-10">
      <div className="plasmo-flex plasmo-justify-center plasmo-items-center plasmo-gap-2">
        <img
          src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\icon.png"
          alt="logo"
          className="plasmo-h-15 plasmo-w-15"
        />
        <p
          className="plasmo-font-sans plasmo-font-normal plasmo-inline-block plasmo-p-0"
          style={{ color: "#29428D", fontSize: 52, fontFamily: "Jockey One" }}>
          XLock
        </p>
      </div>
      <div className="plasmo-mt-3">
        <p
          className="plasmo-font-normal plasmo-text-center plasmo-text-xl"
          style={{ fontFamily: "Jockey One" }}>
          Welcome to XLock Manager
        </p>
      </div>
      <form
        className="plasmo-flex plasmo-flex-col plasmo-justify-center plasmo-items-start plasmo-pt-20 "
        id="formPassword"
        onSubmit={handleSubmit}>
        <label
          htmlFor="inputField"
          className="plasmo-pl-3 plasmo-text-1xl plasmo-mb-1 plasmo-font-medium"
          style={{ fontFamily: "Inter" }}>
          Password
        </label>
        <input
          id="inputField"
          type="password"
          placeholder="Enter password"
          value={password}
          className="plasmo-border plasmo-border-gray-300 plasmo-rounded-md plasmo-pl-3 plasmo-w-72 plasmo-h-10 plasmo-mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="plasmo-w-72 plasmo-h-10 plasmo-border plasmo-rounded-md plasmo-mb-1"
          style={{ backgroundColor: "#0570EB" }}>
          <span
            className="plasmo-text-white plasmo-text-base plasmo-font-semibold"
            style={{ fontFamily: "Inter" }}>
            Next
          </span>
        </button>
      </form>
    </div>
  )
}
