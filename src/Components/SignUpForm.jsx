import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { Spinner } from 'react-bootstrap'
import axios from "axios"
import { toast } from 'react-toastify'
const SignUpForm = () => {
    const navigate = useNavigate()
    const [loading, setLoading]=useState(false)
    const [User, setUser] = useState({
        email:"",
        username:"",
        password:"",
        confirmPassword:"",
    })

    const handleSubmit = (e) =>{
        e.preventDefault()
        // console.log(User)

        axios.post("https://webvalidator-ssl-backend.onrender.com/api/auth/Signup",User).then(res =>{
            setLoading(true)
            // console.log(res.data)

            if(res.data.message === "User created Succefully"){
                localStorage.setItem("User",JSON.stringify(res.data.user))
                setLoading(false)
                navigate("/home")
            }else{
                setLoading(false)
                toast.error(`${res.data.message}`)
                console.log(res.data.message)
            }
            
        }).catch(err=>{
            toast.error(`${err.response.data.message}`)
            console.log(err.response.data.message)}
    )
    }
    
  return (
        <div>
        <Form onSubmit={handleSubmit} style={{backgroundColor:"#242627"}} className='p-4 rounded'>
                    
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" onChange={e => setUser({...User,email:e.target.value})} placeholder="Enter email"  style={{padding:"0.9rem",backgroundColor:"#605C5C", border:"#605C5C", color:"white"}}/>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" onChange={e => setUser({...User,username:e.target.value})} placeholder="Enter email"  style={{padding:"0.9rem",backgroundColor:"#605C5C", border:"#605C5C", color:"white"}}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Enter Password</Form.Label>
                        <Form.Control type="password" onChange={e => setUser({...User,password:e.target.value})} placeholder="Password"  style={{padding:"0.9rem",backgroundColor:"#605C5C", border:"#605C5C", color:"white"}}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>Re-enter Password</Form.Label>
                        <Form.Control type="password" onChange={e => setUser({...User,confirmPassword:e.target.value})} placeholder="Password"  style={{padding:"0.9rem",backgroundColor:"#605C5C", border:"#605C5C", color:"white"}}/>
                    </Form.Group>
        
                    <Button disabled={loading} variant="primary" type="submit" className='w-100 mt-2' style={{padding:"0.9rem"}}>{loading?<Spinner animation="border" />:"Signup"}</Button>
            </Form>
        </div>

  )
}

export default SignUpForm
