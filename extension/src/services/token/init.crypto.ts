import { loadAllWasm } from "@originjs/crypto-js-wasm"

export async function initCrypto() {
  await loadAllWasm()
}
