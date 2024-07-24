export default function requestDeviceId() {
  const id = "dcdmepeacagahbdammaepndegcomiikm"
  chrome.runtime.sendMessage(id, { type: "REQUEST_DEVICE_ID" }, function (res) {
    if (res.success) {
      console.log(res.deviceID)
    } else {
      console.log("CANNOT GET DEVICE ID")
    }
  })
}
