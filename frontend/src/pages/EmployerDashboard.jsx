import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState({ title: '', companyName: '', location: '', jobType: 'Full-Time', salary: '', category: '', description: '' })

  useEffect(() => {
    api.get('/jobs?limit=50').then(res => setJobs(res.data.jobs))
  }, [])

  async function createJob(e) {
    e.preventDefault()
    try {
      const payload = { ...form, salary: form.salary ? Number(form.salary) : undefined }
      const res = await api.post('/jobs', payload)
      setJobs(j => [res.data, ...j])
      setForm({ title: '', companyName: '', location: '', jobType: 'Full-Time', salary: '', category: '', description: '' })
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to create job (are you logged in as employer?)')
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/jobs/${id}`)
      setJobs(j => j.filter(x => x._id !== id))
    } catch (e) {
      alert('Failed to delete job')
    }
  }

  return (
    <div className="container py-8 grid md:grid-cols-2 gap-6">
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="font-semibold mb-3">Post a Job</h2>
        <form onSubmit={createJob} className="grid grid-cols-2 gap-3">
          <input value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} className="border rounded px-3 py-2 col-span-2" placeholder="Job Title" />
          <input value={form.companyName} onChange={(e)=>setForm({...form, companyName:e.target.value})} className="border rounded px-3 py-2" placeholder="Company" />
          <input value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} className="border rounded px-3 py-2" placeholder="Location" />
          <select value={form.jobType} onChange={(e)=>setForm({...form, jobType:e.target.value})} className="border rounded px-3 py-2">
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
          <input value={form.salary} onChange={(e)=>setForm({...form, salary:e.target.value})} className="border rounded px-3 py-2" placeholder="Salary (optional)" />
          <input value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} className="border rounded px-3 py-2 col-span-2" placeholder="Category" />
          <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="border rounded px-3 py-2 col-span-2" rows="5" placeholder="Description" />
          <button className="btn-primary col-span-2">Create</button>
        </form>
      </section>
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="font-semibold mb-3">My Jobs</h2>
        <div className="space-y-3">
          {jobs.map(j => (
            <div key={j._id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{j.title}</div>
                  <div className="text-sm text-gray-600">{j.companyName} · {j.location}</div>
                </div>
                <button onClick={()=>remove(j._id)} className="px-3 py-1 rounded border">Delete</button>
              </div>
              <Applicants jobId={j._id} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Applicants({ jobId }) {
  const [apps, setApps] = useState([])
  useEffect(() => {
    api.get(`/applications/job/${jobId}`).then(res => setApps(res.data))
  }, [jobId])
  return (
    <div className="mt-3">
      <div className="font-medium mb-2">Applicants</div>
      <div className="space-y-2">
        {apps.map(a => (
          <div key={a._id} className="text-sm flex items-center justify-between">
            <div>
              <div>{a.candidateId?.name || 'Candidate'}</div>
              <div className="text-gray-600">Status: {a.status}</div>
            </div>
            {a.resumePath && <a href={`http://localhost:4000/${a.resumePath}`} target="_blank" className="text-blue-600">Resume</a>}
          </div>
        ))}
      </div>
    </div>
  )
}


