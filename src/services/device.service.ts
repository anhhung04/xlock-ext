"use strict"

import { v4 as uuidv4 } from "uuid"

import { sendToBackground } from "@plasmohq/messaging"

export class DeviceService {
  static generateDeviceId = (): string => {
    const uuid = uuidv4()
    return uuid 
  }

  static getFromLocal = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      sendToBackground({
        name: "ping",
        body: {
          action: "getLocalDeviceID"
        }
      })
        .then((response) => {
          if (response.success) {
            resolve(response.deviceID)
          } else {
            reject(new Error("Failed to get deviceID"))
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static saveToLocal = async (device_id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      sendToBackground({
        name: "ping",
        body: {
          action: "setLocalDeviceID",
          device_id: device_id
        }
      })
        .then((response) => {
          if (response.success) {
            resolve()
          } else {
            reject(new Error("Failed to save DeviceID"))
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
