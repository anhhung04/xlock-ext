export interface ItemModel {
  name: string
  site: string
  description: string | null
  enc_credentials: string
  logo_url: string | null
  id: string //uuid
  added_at: Date
  type: string
  updated_at: string | null
}

export interface ShareItemModel {
  name: string
  site: string
  description: string | null
  enc_credentials: string
  logo_url: string | null
  id: string //uuid
  added_at: Date
  type: string
  updated_at: string | null
  shared_at: string
  shared_by: {
    id: string
    username: string
    email: string
  }
}
