import { apiCall } from "~services/api/api"

export async function authenToken(token: string) {
  const responseToken = await apiCall("/api/auth/token", "GET", {}, token)
  return responseToken
}
