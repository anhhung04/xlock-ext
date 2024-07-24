export default function sendToken() {
  const token = "hcmut_bachkhoa_trash"
  const id = "dcdmepeacagahbdammaepndegcomiikm"
  chrome.runtime.sendMessage(
    id,
    { token: token },
    function (res: { success: boolean }) {
      if (res.success) {
        console.log("SEND MESSAGE SUCCESS")
      } else {
        console.log("SEND MESSAGE FAILED")
      }
    }
  )
}
