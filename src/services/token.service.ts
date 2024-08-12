"use strict"

import { sendToBackground } from "@plasmohq/messaging"

import { apiCall } from "../utils/api"

export class TokenService {
  static verifyToken = async (token: string) => {
    const responseToken = await apiCall(
      "/api/v1/auth/verify",
      "POST",
      {
        access_token: `${token}`
      },
      token
    )
    return responseToken
  }

  static getFromLocal = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      sendToBackground({
        name: "ping",
        body: {
          action: "getLocalToken"
        }
      })
        .then((response) => {
          if (response.success) {
            resolve(response.enc_token)
          } else {
            reject(new Error("Failed to retreive local token"))
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static saveToLocal = async (enc_token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      sendToBackground({
        name: "ping",
        body: {
          action: "setLocalToken",
          user_token: enc_token
        }
      })
        .then((response) => {
          if (response.success) {
            resolve()
          } else {
            reject(new Error("Failed to retreive encrypted token"))
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static getFromSession = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      sendToBackground({
        name: "ping",
        body: { action: "getSessionToken" }
      })
        .then((response) => {
          if (response.success && response.user_token) {
            resolve(response.user_token)
          } else {
            reject(new Error("Failed to retrieve token"))
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static saveToSession = async (dec_token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      sendToBackground({
        name: "ping",
        body: {
          action: "setSessionToken",
          user_token: dec_token
        }
      })
        .then((response) => {
          if (response.success) {
            resolve()
          } else {
            reject(new Error("Failed to save token"))
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
