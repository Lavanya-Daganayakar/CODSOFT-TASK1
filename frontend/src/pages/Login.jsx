import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed. If you are new, please register first.')
    }
  }

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-1">Login</h1>
      <p className="mb-4 text-sm text-gray-600">First time here? <Link to="/register" className="text-blue-600 underline">Create an account</Link>.</p>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded-md shadow">
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Email" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Password" />
        <button className="btn-primary w-full">Login</button>
      </form>
    </div>
  )
}


