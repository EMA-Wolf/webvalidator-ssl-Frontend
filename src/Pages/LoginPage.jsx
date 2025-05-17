import React from 'react'
import "./css/LoginPage.css"
import { Outlet, NavLink } from 'react-router-dom'
import miniPerson from "../assets/miniperson.png"
import codeTag from "../assets/codetag.png"
import miniPlant from "../assets/miniplant.png"
import bigPlant from "../assets/bigplant.png"

const LoginPage = () => {

  return (
    <div className="flex justify-center items-center h-screen relative">

      <div className="w-1/3">

        <nav className="flex gap-3 mb-2 text-2xl">
          <NavLink to="" className="text-blue-500 hover:text-blue-700">Login</NavLink>

          <NavLink to="/Signup" className="text-blue-500 hover:text-blue-700">SignUp</NavLink>
        </nav>


        <Outlet />
      </div>


      <img src={miniPerson} alt="" className="w-auto h-1/4 absolute bottom-0 left-0" />
      <img src={codeTag} alt="" className="w-auto h-1/4 absolute top-0 left-0" />
      <img src={miniPlant} alt="" className="w-auto h-1/4 absolute bottom-0 right-0" />
      <img src={bigPlant} alt="" className="w-auto h-1/4 absolute top-0 right-0" />
    </div>
  )
}

export default LoginPage
