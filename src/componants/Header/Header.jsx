import React, { useState } from 'react'
import { NavLink } from "react-router-dom"
import Logo from '../Logo'
import { useSelector } from "react-redux"
import LogoutBtn from './LogoutBtn'

function Header() {
  const [open, setOpen] = useState(false)
  const authstatus = useSelector((state)=> state.auth.status)

  const navItems = [
    { name: "Home", link: "/", active: true },
    { name: "Blogs", link: "/blogs", active: authstatus },
    { name: "Write blog", link: "/Write-blog", active: authstatus },
    { name: "Sign Up", link: "/sign-up", active: !authstatus },
    { name: "Login", link: "/login", active: !authstatus }
  ]

  return (
    <div className='h-14 flex border-b border-white justify-between items-center px-4 md:px-10 bg-black text-white relative'>

      {/* Logo */}
      <div className='flex items-center gap-2'>
        <NavLink to="/">
          <Logo className='w-8' />
        </NavLink>
        <NavLink className="text-lg" to="/">RAWBLOGS</NavLink>
      </div>

      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden text-3xl px-3"
      >
        &#x2261;
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-14 right-2 w-52 flex flex-col gap-2 p-3 
        bg-black border border-gray-700 rounded-lg shadow-lg
        transition-all duration-300 origin-top-right
        ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
      >
        {navItems.filter(item => item.active).map(item => (
          <NavLink
            key={item.name}
            to={item.link}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block w-full text-left px-3 py-2 rounded ${
                isActive
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-amber-50 hover:text-black"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

        {authstatus && (
          <LogoutBtn className="w-full text-left px-3 py-2 rounded hover:bg-amber-50 hover:text-black" />
        )}
      </div>

      {/* Desktop Menu */}
      <div className='hidden sm:flex items-center gap-6'>
        {navItems.filter(item => item.active).map(item => (
          <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) =>
              isActive
                ? "border-b-2 px-3 font-bold"
                : "hover:bg-amber-50 hover:text-black px-3 rounded"
            }
          >
            {item.name}
          </NavLink>
        ))}

        {authstatus && (
          <LogoutBtn className='px-3 py-1 rounded hover:bg-amber-50 hover:text-black' />
        )}
      </div>

    </div>
  )
}

export default Header