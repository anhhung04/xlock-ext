export default function requestEncrypt(
  key: string,
  password?: string
): Promise<{
  concatenatedData: string
  encrypted: string
  salt: string
  initializationVector: string
}> {
  return new Promise((resolve, reject) => {
    const id = "oggondagbjepnifnnmcgdipgbemcimea"
    chrome.runtime.sendMessage(
      id,
      {
        type: "REQUEST_ENCRYPT",
        key: key,
        ...(password && { password })
      },
      (res: {
        success: boolean
        cipherText: string
        salt: string
        initializationVector: string
      }) => {
        if (res.success) {
          const concatenatedData = concatenateData(
            res.cipherText,
            res.initializationVector,
            res.salt
          )
          resolve({
            concatenatedData,
            encrypted: res.cipherText,
            salt: res.salt,
            initializationVector: res.initializationVector
          })
        } else {
          reject(new Error("There is some error"))
        }
      }
    )
  })
}

function concatenateData(
  cipherText: string,
  initializationVector: string,
  salt: string
) {
  return `${initializationVector}::${salt}::${cipherText}`
}
