import React, { useState } from "react"

interface CardProps {
  id: string
  title: string
  handleChecked: (checked: boolean) => void
}

const ButtonCheckbox: React.FC<CardProps> = ({ id, title, handleChecked }) => {
  const [isChecked, setIsChecked] = useState<boolean>(true)
  const icon = chrome.runtime.getURL(`assets/checked.svg`)

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked
    setIsChecked(newChecked)
    handleChecked(newChecked)
  }

  const handleChange = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    handleChecked(newChecked)
  }
  return (
    <div className="plasmo-relative plasmo-mb-6 plasmo-w-fit">
      <input
        className="plasmo-absolute plasmo-top-0 plasmo-left-0 plasmo-w-full plasmo-h-full plasmo-opacity-0 plasmo-cursor-pointer"
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <div
        className={`plasmo-border ${isChecked ? "plasmo-border-blue-500" : "plasmo-border-gray-200"} plasmo-transition-all plasmo-duration-300 plasmo-rounded-[12px] plasmo-h-[30px]`}>
        <div
          className={`plasmo-flex plasmo-justify-start plasmo-gap-${id === "2" ? 3 : 4} plasmo-items-center plasmo-p-1 ${isChecked ? "plasmo-bg-blue-[#e6f1fd] plasmo-text-black" : "plasmo-bg-[#EFF0F0] plasmo-text-[#949999]"} plasmo-rounded-[12px] plasmo-h-[30px]`}>
          <h3 className="plasmo-text-lg plasmo-font-normal plasmo-justify-center plasmo-m-0 plasmo-flex plasmo-items-start">
            <i
              className={`fa fa-check plasmo-mr-2 ${isChecked ? "plasmo-opacity-1" : "plasmo-opacity-0"}`}
              aria-hidden="true"></i>
            <p className="plasmo-text-[14px] plasmo-pointer-events-none plasmo-select-none">
              {title}
            </p>
          </h3>
          <div className="plasmo-text-center">
            <div
              className={` plasmo-w-8 plasmo-h-8 plasmo-bg-center plasmo-bg-no-repeat plasmo-rounded-full ${!isChecked ? "plasmo-opacity-0" : "plasmo-opacity-100"} plasmo-cursor-pointer`}
              style={{
                backgroundImage: !isChecked ? "none" : `url(${icon})`,
                width: 16,
                height: 16
              }}
              onClick={handleChange}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ButtonCheckbox
