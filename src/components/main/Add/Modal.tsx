import React from "react"

interface ModalProps {
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          minWidth: "300px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column"
        }}>
        <h2 className="plasmo-font-['Inter']">Add Successful</h2>
        <p className="plasmo-font-['Inter']">
          Your new account has been added successfully.
        </p>
        <button
          onClick={onClose}
          style={{ margin: "5px", backgroundColor: "#0570EB" }}
          className="plasmo-h-10 plasmo-border plasmo-rounded-md ">
          <span className="plasmo-text-white plasmo-text-base plasmo-font-normal plasmo-font-['Inter']">
            Close
          </span>
        </button>
      </div>
    </div>
  )
}

export default Modal
