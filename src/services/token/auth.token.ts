import { apiCall } from "~services/api/api"

export async function authenToken(token: string) {
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
