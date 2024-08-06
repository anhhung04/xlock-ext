import React, { useEffect, useState } from "react"

import { apiCall } from "~services/api/api"
import { getSessionToken } from "~services/token/get.session.token"

export default function Account() {
  const [fullname, setFullname] = useState<string>("")

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getSessionToken()
      const responseData = await apiCall(
        "/api/v1/auth/user",
        "GET",
        null,
        token
      )
      setFullname(responseData.data.fullname)
      console.log(fullname)
    }

    fetchUser()
  }, [])

  function handleOnClick() {
    window.open(process.env.PLASMO_PUBLIC_FRONTEND_URL + "/home", "_blank")
  }
  return (
    <div
      style={{ height: 472 }}
      className="plasmo-flex plasmo-flex-col plasmo-pt-10 plasmo-items-center">
      <img
        src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\avatar.png"
        alt="avatar"
        width={48}
        height={48}
        className="plasmo-mb-3"
      />
      <p
        className=" plasmo-font-bold plasmo-mb-5"
        style={{ fontSize: "22px", fontFamily: "Inter" }}>
        {fullname}
      </p>

      <button
        className="plasmo-flex plasmo-h-10 plasmo-px-4 plasmo-py-2.5 plasmo-justify-center plasmo-items-center plasmo-gap-5 plasmo-shrink-0 plasmo-mt-40 "
        style={{ borderRadius: 14, border: "2px solid #29428D", width: 310 }}
        onClick={handleOnClick}>
        <span
          className=""
          style={{
            fontFamily: "Inter",
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            color: "#29428D"
          }}>
          Go to XLock Web
        </span>
      </button>
    </div>
  )
}
