import React from 'react'
import "./css/LoginPage.css"
import { Outlet, NavLink } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import miniPerson from "../assets/miniperson.png"
import codeTag from "../assets/codetag.png"
import miniPlant from "../assets/miniplant.png"
import bigPlant from "../assets/bigplant.png"
const LoginPage = () => {

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 position-relative'>

                <div style={{width:"34%"}}>

                <Nav className='d-flex gap-3 mb-2' style={{fontSize:"1.5rem"}}>
                    <NavLink to='' >Login</NavLink>

                    <NavLink to="/Signup">SignUp</NavLink>
                </Nav>

                    
            <Outlet/>
                </div>


            <img src={miniPerson} alt="" className='w-auto h-25 position-absolute bottom-0 start-0'/>
            <img src={codeTag} alt="" className='w-auto h-25 position-absolute top-0 start-0'/>
            <img src={miniPlant} alt="" className='w-auto h-25 position-absolute bottom-0 end-0'/>
            <img src={bigPlant} alt="" className='w-auto h-25 position-absolute top-0 end-0'/>
    </div>
  )
}

export default LoginPage
