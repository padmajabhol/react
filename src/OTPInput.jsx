import { useRef, useState } from "react";

const OTPInput = ({ onComplete }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRef = useRef([]);

  // const handleChange = (index, value) => {
  //   const newArray = [...otp];
  //   newArray[index] = value;
  //   setOtp(newArray)

  //   if (value && index < 3) {
  //     inputRef.current[index + 1].focus();
  //   }

  //   if (newArray.every((d) => d !== "")) {
  //     onComplete(newArray.join(''))
  //   }
  // }

  const handleChange = (index, value) => {
    const newArray = [...otp];
    newArray[index] = value;
    setOtp(newArray);

    if (value && index < 3) {
      inputRef.current[index + 1].focus();
    }

    if (newArray.every((d) => d !== "")) {
      onComplete(newArray.join(""))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] !== "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp)
      } else {
        inputRef.current[index - 1].focus()
      }
    }
  }

  return (
    <div>
      {otp?.map((digit, index) => (
        <input
          key={index}
          ref={(el) => inputRef.current[index] = el}
          type="text"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />))}
    </div>
  )
}

export default OTPInput;