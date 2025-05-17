import React, { useState } from 'react'
import axios from "axios"
import api from '../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const SignUpForm = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [User, setUser] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        api.post("/auth/Signup", User).then(res => {
            if (res.data.message === "User created Succefully") {
                localStorage.setItem("User", JSON.stringify(res.data.user))
                setLoading(false)
                navigate("/home")
            } else {
                setLoading(false)
                toast.error(`${res.data.message}`)
                console.log(res.data.message)
            }

        }).catch(err => {
            setLoading(false)
            toast.error(`${err.response.data.message}`)
            console.log(err.response.data.message)
        }
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='p-4 rounded bg-gray-800'>

                <div className="mb-3">
                    <label className="block text-white">Email address</label>
                    <input type="email" onChange={e => setUser({ ...User, email: e.target.value })} placeholder="Enter email" className='w-full p-3 bg-gray-700 text-white border-none rounded' />
                </div>

                <div className="mb-3">
                    <label className="block text-white">Username</label>
                    <input type="text" onChange={e => setUser({ ...User, username: e.target.value })} placeholder="Enter username" className='w-full p-3 bg-gray-700 text-white border-none rounded' />
                </div>

                <div className="mb-3">
                    <label className="block text-white">Enter Password</label>
                    <input type="password" onChange={e => setUser({ ...User, password: e.target.value })} placeholder="Password" className='w-full p-3 bg-gray-700 text-white border-none rounded' />
                </div>

                <div className="mb-3">
                    <label className="block text-white">Re-enter Password</label>
                    <input type="password" onChange={e => setUser({ ...User, confirmPassword: e.target.value })} placeholder="Password" className='w-full p-3 bg-gray-700 text-white border-none rounded' />
                </div>

                <button disabled={loading} type="submit" className='w-full mt-2 bg-blue-500 text-white p-3 rounded'>{loading ? <span className="animate-spin">Loading...</span> : "Signup"}</button>
            </form>
        </div>

    )
}

export default SignUpForm
