import { Button, Slider, Typography } from "@mui/material"
import React, { useState } from "react"

import ButtonCheckbox from "./ButtonCheckbox"

export default function Generate() {
  const [password, setPassword] = useState<string>("")
  const [length, setLength] = useState<number>(50)
  const [includeDigits, setIncludeDigits] = useState<boolean>(true)
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true)
  const [capitalFirstLetter, setCapitalFirstLetter] = useState<boolean>(true)
  const [includeAmbiguous, setIncludeAmbiguous] = useState<boolean>(true)

  const icon = chrome.runtime.getURL(`assets/copy.svg`)

  const generatePassword = (): void => {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const ambigiousCharacters = "{}[]()/'\"`~,;:.<>\\|"
    const digits = "0123456789"
    const symbols = "!@#$%^&*()"
    if (includeDigits) {
      charset += digits
    }
    if (includeSymbols) {
      charset += symbols
    }
    if (includeAmbiguous) {
      charset += ambigiousCharacters
    }

    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }

    let password = ""

    while (
      !(
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        (/[0-9]/.test(password) || !includeDigits) &&
        (/[!@#$%^&*()]/.test(password) || !includeSymbols) &&
        (new RegExp(`[${escapeRegExp(ambigiousCharacters)}]`).test(password) ||
          !includeAmbiguous)
      )
    ) {
      let tempPassword = ""
      if (capitalFirstLetter) {
        const upperCaseCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        tempPassword +=
          upperCaseCharset[Math.floor(Math.random() * upperCaseCharset.length)]
      }
      tempPassword += Array(length - tempPassword.length)
        .fill(charset)
        .map((x) => x[Math.floor(Math.random() * x.length)])
        .join("")

      password = tempPassword
    }

    // if (capitalFirstLetter) {
    //   password = password.charAt(0).toUpperCase() + password.slice(1)
    // }

    setPassword(password)
  }

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setLength(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    if (newValue === "") {
      setLength(0)
    } else if (!isNaN(Number(newValue))) {
      const value = Number(newValue)
      if (value >= 4 && value <= 100) {
        setLength(value)
      } else if (value < 4) {
        setLength(value)
      } else {
        setLength(100)
      }
    }
  }

  const handleInputBlur = () => {
    if (length <= 4) {
      setLength(4)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(password)
  }

  return (
    <div className="plasmo-w-[358.4px] plasmo-h-[470.4px] plasmo-pt-10 plasmo-flex plasmo-flex-col plasmo-items-center">
      <div className="plasmo-text-[28px] plasmo-font-['Inter'] plasmo-font-semibold">
        <p>Generate password</p>
      </div>
      <div
        className="plasmo-w-80.5 plasmo-h-10 plasmo-flex plasmo-justify-between plasmo-items-center plasmo-rounded-[6px] plasmo-bg-white plasmo-px-5 plasmo-mt-5"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(60, 64, 67, 0.30), 0px 2px 8px 8px rgba(60, 64, 67, 0.15)"
        }}>
        <p
          className="plasmo-flex-grow plasmo-flex-shrink plasmo-truncate"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginRight: 10
          }}>
          {password}
        </p>
        <div
          className="plasmo-flex-shrink-0 hover:plasmo-scale-110 transition active:plasmo-scale-90"
          style={{
            backgroundImage: `url(${icon})`,
            height: 20,
            width: 20
          }}
          onClick={handleCopy}></div>
      </div>

      <div
        className="plasmo-mt-5 plasmo-flex  plasmo-flex-col plasmo-items-start plasmo-p-4 plasmo-w-80.5"
        style={{
          borderRadius: 6,
          background: "#FFF",
          boxShadow:
            "0px 1px 2px 0px rgba(60, 64, 67, 0.30), 0px 2px 8px 8px rgba(60, 64, 67, 0.15)"
        }}>
        <Typography gutterBottom>Your password includes</Typography>
        <div className="plasmo-flex plasmo-gap-4 plasmo-h-10 plasmo-mt-2">
          <ButtonCheckbox
            id="1"
            title="Digits"
            handleChecked={setIncludeDigits}
          />
          <ButtonCheckbox
            id="2"
            title="Ambigious characters"
            handleChecked={setIncludeAmbiguous}
          />
        </div>
        <div className="plasmo-flex plasmo-gap-4 plasmo-h-10">
          <ButtonCheckbox
            id="3"
            title="Capital first letter"
            handleChecked={setCapitalFirstLetter}
          />
          <ButtonCheckbox
            id="4"
            title="Symbols"
            handleChecked={setIncludeSymbols}
          />
        </div>

        <Typography gutterBottom>Password's length</Typography>
        <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
          <div className="plasmo-flex-grow-0">
            <Slider
              value={length}
              onChange={handleSliderChange}
              aria-labelledby="password-length-slider"
              valueLabelDisplay="auto"
              min={4}
              max={100}
              style={{ flex: 1, marginLeft: 8, marginRight: 220 }}
            />
          </div>
          <div className="plasmo-flex-grow-0">
            <input
              type="text"
              value={length}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              aria-labelledby="password-length-slider"
              pattern="[0-9]*"
              inputMode="numeric"
              style={{
                width: 40,
                height: 40,
                marginLeft: 20,
                backgroundColor: "#EFF0F0",
                textAlign: "center",
                borderRadius: 12,
                fontSize: 12,
                fontFamily: "Inter"
              }}
            />
          </div>
        </div>
      </div>
      <div className="plasmo-w-80.5 plasmo-mt-10">
        <Button
          variant="contained"
          sx={{ backgroundColor: "#0570EB", color: "#fff", width: "100%" }}
          fullWidth
          onClick={generatePassword}>
          <span className="plasmo-font-['Inter'] plasmo-font-[15px]">
            Generate
          </span>
        </Button>
      </div>
    </div>
  )
}
