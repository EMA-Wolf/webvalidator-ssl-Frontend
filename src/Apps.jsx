import {React, useState, useEffect} from 'react'
import {BrowserRouter, Routes ,Route, useNavigate} from "react-router-dom"
import Base from './Pages/Base'
import LoginPage from './Pages/LoginPage'
import SignUpForm from './Components/SignUpForm'
import LoginForm from './Components/LoginForm'
import SiteCheckerPage from './Pages/SiteCheckerPage'
import { ToastContainer } from 'react-toastify'
import SslGeneratorPage from './Pages/SslGeneratorPage'
import DomainLookupPage from './Pages/DomainLookupPage'
const Apps = () => {
  return (
    <>
      <BrowserRouter>
            <Routes>
              {/* Login and Sign up */}
                <Route path='' element={<LoginPage/>}>
                  <Route path='/' element={<LoginForm/>}></Route>
                  <Route path='/Signup' element={<SignUpForm/>}></Route>
                </Route>

          {/* Homepage and others */}
             <Route  element={ <Base /> }>
                   <Route path='/home' element={<SiteCheckerPage/>}></Route>
                   <Route path='/sslgenerator' element={<SslGeneratorPage/>}></Route>
                   <Route path='/domainLookup' element={<DomainLookupPage/>}></Route>
                </Route>

            </Routes>
            <ToastContainer position='top-center' theme='dark' className='w-50'/>
      </BrowserRouter>
    </>
  )
}

export default Apps
