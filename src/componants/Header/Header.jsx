import React, { useState } from 'react'
import { Link, NavLink } from "react-router-dom"
import Logo from '../Logo'
import { useSelector } from "react-redux"
import LogoutBtn from './LogoutBtn'
function Header() {

  const [open, setOpen] = useState(false)
  const authstatus = useSelector((state)=> state.auth.status)
  console.log(authstatus)

  const navItems = [
    {
      name: "Home",
      link: "/",
      active: true
    },
    {
      name: "Blogs",
      link: "/blogs",
      active: authstatus
    },
    {
      name: "Write blog",
      link: "/Write-blog",
      active: authstatus
    },
    {
      name: "Sign Up",
      link: "/sign-up",
      active: !authstatus
    },
    {
      name: "Login",
      link: "/login",
      active: !authstatus
    }


  ]
  return (

    <>







      <div className='h-14 flex border-b border-white justify-between p-2 px-3 md:px-10 bg-black text-white'  >

        <div className=' flex items-center gap-2' >
          <NavLink to="/" >

            <Logo className=' w-8  ' />
          </NavLink>

          <NavLink className="text-lg " to="/" >

            RAWBLOGS
          </NavLink>

        </div>

        <div>
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden px-5 cursor-pointer hover:text-blue-300 text-3xl"
          >
            &#x2261;
          </button>

          <div
            className={`flex flex-col absolute right-0 gap-2 p-3 bg-black rounded 
    transform transition-all duration-300 origin-top
    ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
          >
            {
              navItems
                .filter((item) => item.active)
                .map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.link}
                    className={({ isActive }) =>
                      isActive
                        ? "border-b-2 self-baseline px-3 md:px-6 font-bold"
                        : "hover:bg-amber-50 hover:text-black px-3 md:px-6 rounded"
                    }
                  >
                    {item.name}
                  </NavLink>
                ))
            }

            {
              authstatus && (
                <LogoutBtn className="hover:bg-amber-50 hover:text-black px-3 md:px-6 rounded" />
              )
            }
          </div>
        </div>

        <div className='hidden  sm:flex items-center gap-4 md:gap-8 ' >
          {
            navItems.filter((item) => item.active).map((item) => (
              <NavLink className={({ isActive }) => isActive ? "  border-b-2 px-3  md:px-6 font-bold duration-200 " : " hover:bg-amber-50 hover:text-black px-3 md:px-6  rounded duration-200  "} key={item.name} to={item.link} >
                {item.name}
              </NavLink>
            ))
          }

          {
            authstatus && <LogoutBtn className='hover:bg-amber-50 hover:text-black  px-3 md:px-6 rounded duration-200' />
          }

        </div>



      </div>

    </>
  )
}

export default Header