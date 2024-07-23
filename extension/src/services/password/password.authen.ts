import { apiCall } from "~services/api/api"
import { decryptToken } from "~services/token/decrypt.token"
import { getEncryptedToken } from "~services/token/get.token"

import { getSalt } from "./get.salt"
import { deriveKey } from "./password.hash"

interface Body {
  Password: string
}

export async function authenPassword(path: string, body: Body) {
  const encryptedToken = await getEncryptedToken()
  const salt = await getSalt()
  const token = await decryptToken(encryptedToken, body.Password, salt)
  const { key: hassPass, salt: existSalt } = await deriveKey(
    body.Password,
    salt
  )

  const responseData = await apiCall(
    path,
    "POST",
    {
      Password: hassPass
    },
    token
  )

  return responseData
}
