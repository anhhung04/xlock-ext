import React from "react"

interface ModalProps {
  isOpen: boolean
  onConfirm: () => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div
      className="plasmo-fixed plasmo-top-0 plasmo-left-0 plasmo-flex plasmo-justify-center plasmo-items-center plasmo-w-full plasmo-h-full"
      style={{ background: "rgba(0,0,0,0.5" }}>
      <div
        className="plasmo-bg-white plasmo-p-8 plasmo-rounded-[5px] plasmo-w-[300px]"
        style={{ boxShadow: "0 5px 5px rgba(0,0,0,0.3)" }}>
        <h2 className="plasmo-text-center plasmo-text-2xl plasmo-font-semibold">
          Session Expired
        </h2>
        <p>Your session has expired. Please log in again.</p>
        <div className="plasmo-flex plasmo-gap-2 plasmo-w-full">
          <button
            onClick={onConfirm}
            style={{ margin: "5px", backgroundColor: "#0570EB" }}
            className="plasmo-h-10 plasmo-w-full plasmo-border plasmo-rounded-md ">
            <span className="plasmo-text-white plasmo-text-base plasmo-font-normal plasmo-font-['Inter']">
              Log in
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
