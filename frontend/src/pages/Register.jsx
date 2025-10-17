import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' })
  const [resume, setResume] = useState(null)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v])=>fd.append(k, v))
      if (resume) fd.append('resume', resume)
      const res = await api.post('/auth/register', fd)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded-md shadow">
        <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Name" />
        <input value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Email" />
        <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Password" />
        <select value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})} className="w-full border rounded px-3 py-2">
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e)=>setResume(e.target.files[0])} />
        <button className="btn-primary w-full">Register</button>
      </form>
    </div>
  )
}


