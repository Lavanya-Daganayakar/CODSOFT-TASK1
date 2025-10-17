import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Home() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ keywords: '', location: '', category: '' })

  function submit(e) {
    e.preventDefault()
    const params = new URLSearchParams(form)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white relative">
        <div className="container py-20">
          <p className="text-white/80 mb-2">4536+ Jobs listed</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Find your Dream Job</h1>
          <p className="text-white/90 mb-6 max-w-2xl">We provide online instant cash loans with quick approval that suit your term length</p>
          
          <form onSubmit={submit} className="bg-white rounded-md p-4 grid grid-cols-1 md:grid-cols-4 gap-3 mt-10 shadow-lg">
            <input value={form.keywords} onChange={(e)=>setForm({...form, keywords:e.target.value})} className="text-black border rounded-md px-3 py-2" placeholder="Search keyword" />
            <input value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} className="text-black border rounded-md px-3 py-2" placeholder="Location" />
            <input value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} className="text-black border rounded-md px-3 py-2" placeholder="Category" />
            <button className="btn-green">Find Job</button>
          </form>
        </div>
      </section>
      <FeaturedJobs />
    </div>
  )
}

function FeaturedJobs() {
  const [jobs, setJobs] = useState([])
  useEffect(() => {
    api.get('/jobs?limit=5').then((res) => setJobs(res.data.jobs)).catch(()=>{})
  }, [])
  return (
    <section className="container py-10">
      <h2 className="text-2xl font-semibold mb-4">Featured Jobs</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(j => (
          <Link key={j._id} to={`/jobs/${j._id}`} className="bg-white p-4 rounded-md shadow hover:shadow-md transition block">
            <div className="font-semibold">{j.title}</div>
            <div className="text-sm text-gray-600">{j.companyName} · {j.location}</div>
            <div className="text-sm mt-1">{j.jobType}{j.salary?` · $${j.salary}`:''}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}


