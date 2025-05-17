import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { IoSearch, IoExitOutline, IoDocumentTextSharp } from "react-icons/io5";
import Logo from "../assets/blueLogo.png"
import "./css/SideBar.css"

const SideBar = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("User")
        navigate("/")
    }

    return (
        <div className="bg-gray-800 w-1/4 h-scren p-4 flex flex-col" id='sidebar'>

            <div className='header flex justify-center items-center py-4 border-b border-gray-700'>
                <img src={Logo} alt="" className="h-14 pb-1" />

                <h3 className="text-white text-2xl">Site Guard Pro</h3>

            </div>


            <nav className="flex flex-col items-center gap-5 py-5 vh-100 text-lg">

                <NavLink to="/home" className="p-3 border w-full rounded flex items-center gap-2 hover:bg-gray-700">
                    <IoSearch className="text-white" /> <span className="text-white">Site Checker</span>
                </NavLink>

                <NavLink to="/sslgenerator" className="p-3 border w-full rounded flex items-center gap-2 hover:bg-gray-700">
                    <IoDocumentTextSharp className="text-white" /> <span className="text-white">SSL Generator</span>
                </NavLink>

                <NavLink to="/domainLookup" className="p-3 border w-full rounded flex items-center gap-2 hover:bg-gray-700">
                    <IoSearch className="text-white" /> <span className="text-white">Domain Lookup</span>
                </NavLink>

                {/* <NavLink to="/vunlerabilityScan" className='p-3 border w-100 rounded'>
                    <div className='d-flex align-items-center gap-2'><IoSearch /> <span>Vulnerability Scan</span></div>
                </NavLink> */}

            </nav>


            <div className='border-t border-gray-700 p-3'>

                <button onClick={logout} className="flex gap-4 items-center w-full text-lg text-white hover:bg-gray-700">
                    <IoExitOutline /> <span className='mb-1'>Logout</span>
                </button>

            </div>

        </div>
    )
}

export default SideBar
