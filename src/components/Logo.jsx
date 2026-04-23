import React from 'react'
import logo from "../assets/logo.svg"
function Logo({
    className = ""
}) {
  return (
    <>
    <img className={`${className}  rounded-lg `}  src={logo} alt="logo" /></>
  )
}

export default Logo