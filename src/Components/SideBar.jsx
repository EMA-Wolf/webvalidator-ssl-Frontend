import React from 'react'
import {NavLink, useNavigate } from 'react-router-dom'
import Nav from "react-bootstrap/Nav"
import { IoSearch } from "react-icons/io5";
import { IoExitOutline } from "react-icons/io5";
import { IoDocumentTextSharp } from "react-icons/io5";
import Button from 'react-bootstrap/Button';
import "./css/SideBar.css"
const SideBar = () => {
    const navigate = useNavigate()

    const logout = () =>{
        localStorage.removeItem("User")
        navigate("/")
    }

  return (
    <div style={{backgroundColor:"#242627"}} className='w-25 vh-100 ps-4 pe-4 pt-2 d-flex flex-column' id='sidebar'>

            <div className='header d-flex justify-content-center pt-4 pb-3 border-bottom'><h3>Site Checker</h3></div>

           
                <Nav className="flex-column align-items-center justify-content-between pt-5 pb-5 vh-100" style={{fontSize:"1.3rem"}}>

                <NavLink to="/home" className='p-3 border w-100 rounded'>
                    <div className='d-flex align-items-center gap-2'><IoSearch /> <span>Site Checker</span></div>
                </NavLink>

                <NavLink to="/sslgenerator" className='p-3 border w-100 rounded'>
                    <div className='d-flex align-items-center gap-2'><IoDocumentTextSharp /> <span>SSL Generator</span></div>
                </NavLink>

                <NavLink to="n" className='p-3 border w-100 rounded'>
                    <div className='d-flex align-items-center gap-2'><IoSearch /> <span>Active</span></div>
                </NavLink>

                <NavLink to="n" className='p-3 border w-100 rounded'>
                    <div className='d-flex align-items-center gap-2'><IoSearch /> <span>Active</span></div>
                </NavLink>

                </Nav>
           

            <div className='border-top p-3'>

            <Button onClick={logout} className='d-flex gap-4 align-items-center w-100' style={{backgroundColor:"transparent", border:"none", fontSize:"1.4rem"}}>
                        <IoExitOutline /> <span className='mb-1'>Logout</span>
            </Button>

            </div>

    </div>
  )
}

export default SideBar
