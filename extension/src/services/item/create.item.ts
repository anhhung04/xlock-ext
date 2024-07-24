import { apiCall } from "~services/api/api"
import { getSessionToken } from "~services/token/get.session.token"

import type { CreateItem } from "./types/CreateItem"
import type { Item } from "./types/Item"

export default async function createItem(
  user_id: string,
  itemData: CreateItem
): Promise<Item | null> {
  if (!user_id) {
    return null
  }
  try {
    const token = await getSessionToken()
    const responseData = await apiCall(
      process.env.PLASMO_PUBLIC_BACKEND_URL + `/api/users/${user_id}/items`,
      "POST",
      itemData,
      token
    )
  } catch (error) {
    console.error(error)
  }
}
