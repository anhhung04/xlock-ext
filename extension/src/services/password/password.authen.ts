import { apiCall } from "~services/api/api"
import { decryptToken } from "~services/token/decrypt.token"
import { getEncryptedToken } from "~services/token/get.local.token"

import { getSalt } from "./get.salt"
import { deriveKey } from "./password.hash"

interface Body {
  Password: string
}

export async function authenPassword(path: string, body: Body) {
  const encryptedToken = await getEncryptedToken()
  const token = await decryptToken(encryptedToken, body.Password)

  const responseData = await apiCall(
    path,
    "POST",
    {
      Password: body.Password
    },
    token
  )

  return responseData
}
