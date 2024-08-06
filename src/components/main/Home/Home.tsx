import React, { useEffect, useState } from "react"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

import type { ItemModel, ShareItemModel } from "~components/types/Item"
import { apiCall } from "~services/api/api"
import { getSessionToken } from "~services/token/get.session.token"

import AccountCard from "./AccountCard"
import Modal from "./Modal"

interface TabInfo {
  title: string
  favicon: string
}

interface HomeProps {
  loginSuccess: boolean
  onAddAccount: () => void
}

export default function Home({ loginSuccess, onAddAccount }: HomeProps) {
  const [tabInfo, setTabInfo] = useState<TabInfo>({ title: "", favicon: "" })
  const [accountCards, setAccountCards] = useState<
    (ItemModel | ShareItemModel)[]
  >([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const icon = chrome.runtime.getURL(`assets/Edit.svg`)

  const getURL = () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0]
        if (currentTab && currentTab.url) {
          const parsedURL = new URL(currentTab.url)
          const port = parsedURL.port ? `:${parsedURL.port}` : ""
          const mainURL = `${parsedURL.protocol}//${parsedURL.hostname}${port}`
          resolve(mainURL)
        } else {
          reject("No active tab found or tab URL is missing")
        }
      })
    })
  }

  const fetchAccountCards = async () => {
    try {
      const mainURL = await getURL()

      const token = await getSessionToken()

      const responseData = await apiCall(
        `/api/v1/items/?site=${mainURL}`,
        "GET",
        null,
        token
      )

      if (responseData["code"] === 401) {
        throw new Error(responseData["message"])
      }

      const listAccountCards: (ItemModel | ShareItemModel)[] = responseData.data
      setAccountCards(listAccountCards)

      if (listAccountCards.length === 0) {
        setShowModal(true)
      }

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

  const handleAddAccount = () => {
    setShowModal(false)
    onAddAccount()
  }

  const handleEditClick = async () => {
    try {
      sendToBackground({
        name: "ping",
        body: {
          action: "redirectURL",
          url: process.env.PLASMO_PUBLIC_FRONTEND_URL
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

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
          <div
            className="active:plasmo-scale-110"
            onClick={handleEditClick}
            style={{
              backgroundImage: `url(${icon})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              width: 30,
              height: 30,
              cursor: "pointer"
            }}></div>
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
            description={accountCard.description}
            credentials={accountCard.enc_credentials}
          />
        ))}
        {showModal && (
          <Modal
            onClose={() => setShowModal(false)}
            onAddAccount={handleAddAccount}
          />
        )}
      </div>
    </div>
  )
}
