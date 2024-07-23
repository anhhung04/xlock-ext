import React, { useState } from "react"

interface ButtonProps {
  label: string
  onCheck: (isChecked: boolean) => void
}

export default function Button({ label, onCheck }: ButtonProps) {
  const [isChecked, setIsChecked] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    const newChecked = !isChecked
    setIsChecked(newChecked)
    onCheck(newChecked)
  }

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <div
        className="toggle-switch"
        style={{
          position: "relative",
          width: "100px",
          display: "inline-block",
          textAlign: "left",
          top: "3px"
        }}>
        <input
          type="checkbox"
          style={{ display: "none" }}
          className="checkbox"
          name={label}
          id={label}
          checked={isChecked}
          onChange={handleChange}
        />
        <label
          className="label"
          htmlFor={label}
          style={{
            display: "block",
            overflow: "hidden",
            cursor: "pointer",
            border: "0 solid #bbb",
            borderRadius: "20px"
          }}>
          <span
            className="inner"
            style={{
              display: "block",
              width: "220%",
              marginLeft: isChecked ? "0" : "-110%",
              transition: "margin 0.3s ease-in 0s",
              height: "36px",
              lineHeight: "36px",
              fontSize: "14px",
              fontWeight: "semibold",
              boxSizing: "border-box",
              position: "relative"
            }}>
            <span
              style={{
                float: "left",
                width: "50%",
                height: "36px",
                padding: 0,
                lineHeight: "36px",
                color: "#0157B9",
                fontWeight: "bold",
                boxSizing: "border-box",
                paddingRight: "35px",
                backgroundColor: "#D7F3FD",
                textAlign: "center"
              }}>
              Reveal
            </span>
            <span
              style={{
                float: "left",
                width: "50%",
                height: "36px",
                lineHeight: "36px",
                color: "#585F5F",
                fontWeight: "bold",
                boxSizing: "border-box",
                backgroundColor: "#F1EDED",
                textAlign: "center"
              }}>
              Hide
            </span>
          </span>
          <span
            className="switch"
            style={{
              display: "block",
              width: "27px",
              height: "27px",
              margin: "4px",
              background: "#fff",
              position: "absolute",
              top: 0,
              bottom: 0,
              right: isChecked ? "0" : "63px",
              border: "0 solid #bbb",
              borderRadius: "20px",
              transition: "all 0.3s ease-in 0s"
            }}></span>
        </label>
      </div>
    </div>
  )
}
