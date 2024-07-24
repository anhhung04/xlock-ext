import { v4 as uuidv4 } from "uuid"

export default function generateDeviceId(): string {
  const uuid = uuidv4()
  const result = uuid.replace(/-/g, "")
  return result
}
