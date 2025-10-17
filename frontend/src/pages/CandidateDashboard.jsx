import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function CandidateDashboard() {
  const { user, login } = useAuth()
  const [apps, setApps] = useState([])
  const [profile, setProfile] = useState({ name: '', location: '', skills: '', experience: '' })
  const [resume, setResume] = useState(null)

  useEffect(() => {
    api.get('/applications/me').then(res => setApps(res.data)).catch(()=>{})
    api.get('/auth/me').then(res => {
      setProfile({
        name: res.data.name || '',
        location: res.data.profileDetails?.location || '',
        skills: (res.data.profileDetails?.skills || []).join(', '),
        experience: res.data.profileDetails?.experience || ''
      })
    }).catch(()=>{})
  }, [])

  async function saveProfile(e) {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('name', profile.name)
      const details = { location: profile.location, experience: profile.experience, skills: profile.skills.split(',').map(s=>s.trim()).filter(Boolean) }
      fd.append('profileDetails', JSON.stringify(details))
      if (resume) fd.append('resume', resume)
      const res = await api.patch('/auth/me', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      // update auth state
      login(localStorage.getItem('token'), res.data)
      alert('Profile saved')
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save profile')
    }
  }

  return (
    <div className="container py-8 grid md:grid-cols-2 gap-6">
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="font-semibold mb-3">Profile</h2>
        <form onSubmit={saveProfile} className="space-y-3">
          <input value={profile.name} onChange={(e)=>setProfile({...profile, name:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Name" />
          <input value={profile.location} onChange={(e)=>setProfile({...profile, location:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Location" />
          <input value={profile.skills} onChange={(e)=>setProfile({...profile, skills:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Skills (comma separated)" />
          <textarea value={profile.experience} onChange={(e)=>setProfile({...profile, experience:e.target.value})} className="w-full border rounded px-3 py-2" rows="4" placeholder="Experience" />
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e)=>setResume(e.target.files[0])} />
          <button className="btn-primary">Save</button>
        </form>
      </section>
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="font-semibold mb-3">My Applications</h2>
        <div className="space-y-3">
          {apps.map(a => (
            <div key={a._id} className="border rounded p-3">
              <div className="font-medium">{a.jobId?.title}</div>
              <div className="text-sm text-gray-600">{a.jobId?.companyName}</div>
              <div className="text-sm">Status: {a.status}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


