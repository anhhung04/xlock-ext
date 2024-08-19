import { DeviceService } from "~services/device.service"

export async function apiCall(
  path = "/api",
  method = "GET",
  body = null,
  token?: string
) {
  try {
    const device_id = await DeviceService.getFromLocal()

    const headers = {
      "Content-type": "application/json",
      "X-Device-ID": device_id,
      Authorization: `Bearer ${token}`
    }

    const res = await fetch(
      (process.env.PLASMO_PUBLIC_BACKEND_URL || "http://localhost:8000") + path,
      {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
        credentials: "include"
      }
    )

    if (res.status === 401) {
      return { code: 401, message: "Unauthorized" }
    }

    if (res.status === 403) {
      return { code: 403, message: "Forbidden" }
    }

    if (res.status === 422) {
      return { code: 422, message: "Validation Error" }
    }

    return await res.json()
  } catch (error) {
    return {
      code: 500,
      message: "Internal Server Error"
    }
  }
}
