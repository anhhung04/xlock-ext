import { apiCall } from "~services/api/api"

interface Body {
  password: string
  decryptedToken: string
}

export async function authenPassword(path: string, body: Body) {
  const responseData = await apiCall(path, "POST", {
    email: "user6@gmail.com",
    password: body.password
  })

  return responseData
}
