import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Spin } from 'antd';

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e) => {
    // console.log(loginDetails)
    e.preventDefault()
    setLoading(true)
    api.post("/auth/Login", loginDetails).then(res => {
      if (res.data.message == "Login succesfully") {
        // console.log(res.data.user)
        localStorage.setItem("User", JSON.stringify(res.data.user))
        setLoading(false)
        navigate("/home")
      }
    }).catch(err => {
      console.log(err.response.data.message)
      toast.error(`${err.response.data.message}`)
      setLoading(false)
    }
    )
  }
  return (
    <div className="bg-gray-800 p-4  rounded">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-3">
          <label className="block text-white">Email address</label>
          <input
            type="email"
            onChange={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })}
            placeholder="Enter email"
            className="w-full p-3 bg-gray-700 border border-gray-700 text-white rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-white">Password</label>
          <input
            type="password"
            onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
            placeholder="Password"
            className="w-full p-3 bg-gray-700 border border-gray-700 text-white rounded"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          {loading ? <Spin /> : 'Login'}
        </button>
      </form>

      <Link className='text-blue-500' to='/Reset-password'>Forgotten your password?</Link>
    </div>
  )
}

export default LoginForm
