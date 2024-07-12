import React, { useState } from 'react'
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { Spinner } from 'react-bootstrap'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const LoginForm = () => {
  const [loading, setLoading]=useState(false)
  const navigate = useNavigate()
  const [loginDetails, setLoginDetails] = useState({
    email:"",
    password:"",
  })

  const handleSubmit = (e) =>{
    // console.log(loginDetails)
    e.preventDefault()
    setLoading(true)
    axios.post("https://webvalidator-ssl-backend.onrender.com/api/auth/Login",loginDetails).then(res=>{
     if(res.data.message == "Login succesfully"){
      // console.log(res.data.user)
      localStorage.setItem("User",JSON.stringify(res.data.user))
      setLoading(false)
      navigate("/home")
     }
    }).catch(err=>{
      console.log(err.response.data.message)
      toast.error(`${err.response.data.message}`)
      setLoading(false)
    }
    )
}
  return (
    <div>
         <Form onSubmit={handleSubmit} style={{backgroundColor:"#242627"}} className='p-4 rounded'>
                    
                    <Form.Group className="mb-4" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" onChange={e=> setLoginDetails({...loginDetails,email:e.target.value})} placeholder="Enter email"  style={{padding:"0.9rem",backgroundColor:"#605C5C", border:"#605C5C", color:"white"}}/>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" onChange={e=> setLoginDetails({...loginDetails,password:e.target.value})} placeholder="Password" style={{padding:"0.9rem",backgroundColor:"#605C5C", border:"#605C5C", color:"white"}}/>
                    </Form.Group>
        
              <Button disabled={loading} variant="primary" type="submit" className='w-100 mt-2' style={{padding:"0.9rem"}}>{loading?<Spinner animation="border"/>:`Login`}</Button>
            </Form>
    </div>
  )
}

export default LoginForm
