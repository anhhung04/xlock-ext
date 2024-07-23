import React, { useEffect, useState } from "react"

import { apiCall } from "~services/api/api"
import { getSessionToken } from "~services/token/get.session.token"

import AccountCard from "./AccountCard"

interface accountCards {
  credential_id: string
  username: string
  password: string
}

interface TabInfo {
  title: string
  favicon: string
}

interface AccountCardInfo {
  id: string
  username: string
  password: string
}

export default function Home({ loginSuccess }) {
  const [tabInfo, setTabInfo] = useState<TabInfo>({ title: "", favicon: "" })

  const [accountCards, setAccountCards] = useState<AccountCardInfo[]>([])

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

  const fetchAccountCards = async () => {
    try {
      const token = await getSessionToken()
      const mainURL = await getURL()

      /*SOMEHOW I GOT STUCK AT THIS SHIT SO I WILL USE FULL URL*/
      // const responseData = await apiCall(
      //   "/api/user/account",
      //   "GET",
      //   {
      //     url: mainURL
      //   },
      //   token
      // )

      const responseData = await fetch(
        "http://localhost:8000/api/user/account",
        {
          method: "GET",
          headers: {
            "content-type": "application/json"
          }
        }
      )

      if (responseData["code"] === 401) {
        throw new Error(responseData["message"])
      }

      const listAccountCards: AccountCardInfo[] = await responseData.json()
      setAccountCards(listAccountCards)

      console.log("Fetched account cards successfully", responseData)
    } catch (error) {
      console.error("Error fetching account cards:", error)
    }
  }

  useEffect(() => {
    if (loginSuccess) {
      fetchAccountCards()
    }
  }, [loginSuccess])

  useEffect(() => {
    const updateTabInfo = (tabs) => {
      const activeTab = tabs[0]
      setTabInfo({
        title: activeTab.title,
        favicon: activeTab.favIconUrl
      })
    }

    chrome.tabs.query({ active: true, currentWindow: true }, updateTabInfo)

    const handleTabActivated = (activeInfo) => {
      chrome.tabs.get(activeInfo.tabId, updateTabInfo)
    }

    chrome.tabs.onActivated.addListener(handleTabActivated)

    return () => {
      chrome.tabs.onActivated.removeListener(handleTabActivated)
    }
  }, [])

  return (
    <div className="" style={{ height: 472 }}>
      <div className="plasmo-mt-3.5 plasmo-px-5 plasmo-flex plasmo-justify-between plasmo-items-center plasmo-gap-4">
        <div className="plasmo-flex plasmo-justify-start plasmo-items-center plasmo-py-5  plasmo-w-auto plasmo-flex-shrink-0 plasmo-gap-2">
          <img
            src={tabInfo.favicon}
            width={40}
            height={40}
            className="plasmo-max-w-10 plasmo-h-10 "
          />
          <p
            className="plasmo-inline-block plasmo-font-semibold"
            style={{
              fontFamily: "Inter",
              maxWidth: 200,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontSize: 24
            }}>
            {tabInfo.title}
          </p>
        </div>
        <div className="plasmo-w-13 plasmo-inline-block">
          <button>
            <img
              src="D:\ProgrammingCode\Chrome Extension\Plasmo\xlock-extension\extension\assets\option.png"
              width={28}
              height={28}
              className="plasmo-max-w-7eplasmo-h-7 plasmo-my-2.5 plasmo-mx-1.5"
            />
          </button>
        </div>
      </div>
      <div
        className="plasmo-flex plasmo-flex-col plasmo-px-5 plasmo-flex-grow plasmo-gap-6"
        style={{
          height: "368px",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}>
        {accountCards.map((accountCard, index) => (
          <AccountCard
            key={index}
            buttonKey={index.toString()}
            credentialID={accountCard.id}
            username={accountCard.username}
            password={accountCard.password}
          />
        ))}
      </div>
    </div>
  )
}
