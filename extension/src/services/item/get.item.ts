import { apiCall } from "~services/api/api"
import { getSessionToken } from "~services/token/get.session.token"

import type { Item } from "./types/Item"

export default async function getItems(user_id: string): Promise<Item[]> {
  if (!user_id) {
    return []
  }
  try {
    const token = await getSessionToken()
    const itemList = await apiCall(
      process.env.PLASMO_PUBLIC_BACKEND_URL + `/api/users/${user_id}/items`,
      "GET",
      {},
      token
    )
    if (itemList && itemList.code === 200 && itemList.status === "OK") {
      return itemList.data as Item[]
    } else {
      console.error("Failed to fetch items:", itemList)
      return []
    }
  } catch (error) {
    console.error(error)
    return []
  }
}
