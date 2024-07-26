import { apiCall } from "~services/api/api"
import { decryptToken } from "~services/token/decrypt.token"
import { getEncryptedToken } from "~services/token/get.local.token"

interface Body {
  password: string
  decryptedToken: string
}

export async function authenPassword(path: string, body: Body) {
  const responseData = await apiCall(
    path,
    "POST",
    {
      Password: body.password
    },
    body.decryptedToken
  )

  return responseData
}
