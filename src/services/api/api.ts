export async function apiCall(
  path = "/api",
  method = "GET",
  body = null,
  token: string
) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    }

    if (body) {
      headers["Content-type"] = "application/json"
    }
    const res = await fetch(
      (process.env.PLASMO_PUBLIC_BACKEND_URL || "http://localhost:8000") + path,
      {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      }
    )

    if (res.status === 401) {
      return { code: 401, message: "Unauthorized" }
    }

    if (res.status === 403) {
      return { code: 403, message: "Forbidden" }
    }

    return await res.json()
  } catch (error) {
    return {
      code: 500,
      message: "Server error"
    }
  }
}
