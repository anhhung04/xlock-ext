import React from "react"

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  onLogin: () => void
  message: string
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  onLogin,
  message
}) => {
  if (!isVisible) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Warning</h2>
        <p>{message}</p>
        <button onClick={onLogin}>Login</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default Modal
