import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [resume, setResume] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => setJob(res.data))
  }, [id])

  async function apply(e) {
    e.preventDefault()
    const form = new FormData()
    form.append('jobId', id)
    if (coverLetter) form.append('coverLetter', coverLetter)
    if (resume) form.append('resume', resume)
    try {
      await api.post('/applications', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert('Application submitted')
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to apply (are you logged in as candidate?)')
    }
  }

  if (!job) return <div className="container py-8">Loading...</div>
  return (
    <div className="container py-8 grid md:grid-cols-3 gap-6">
      <section className="md:col-span-2 bg-white p-6 rounded-md shadow">
        <h1 className="text-2xl font-semibold">{job.title}</h1>
        <div className="text-sm text-gray-600">{job.companyName} · {job.location}</div>
        <div className="mt-4 whitespace-pre-wrap">{job.description}</div>
      </section>
      <aside className="bg-white p-6 rounded-md shadow">
        <div className="font-semibold mb-2">Job Info</div>
        <div className="text-sm">Type: {job.jobType}</div>
        {job.salary ? <div className="text-sm">Salary: ${job.salary}</div> : null}
        {user?.role === 'candidate' ? (
          <form onSubmit={apply} className="mt-4 space-y-3">
            <textarea value={coverLetter} onChange={(e)=>setCoverLetter(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Cover letter" />
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e)=>setResume(e.target.files[0])} />
            <button className="btn-primary w-full">Apply Now</button>
          </form>
        ) : (
          <div className="text-sm text-gray-600 mt-4">Login as candidate to apply.</div>
        )}
      </aside>
    </div>
  )
}


