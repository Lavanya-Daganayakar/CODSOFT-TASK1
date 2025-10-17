import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../lib/api'

export default function Jobs() {
  const { search } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const [filters, setFilters] = useState({
    keywords: params.get('keywords') || '',
    location: params.get('location') || '',
    category: params.get('category') || '',
    jobType: '',
    minSalary: '',
    maxSalary: ''
  })
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ jobs: [], total: 0, limit: 10 })

  useEffect(() => {
    const searchParams = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) searchParams.set(k, v) })
    searchParams.set('page', String(page))
    api.get(`/search/jobs?${searchParams.toString()}`).then((res) => setData(res.data))
  }, [filters, page])

  return (
    <div className="container py-8 grid md:grid-cols-4 gap-6">
      <aside className="md:col-span-1 bg-white p-4 rounded-md shadow">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="space-y-3">
          <input value={filters.location} onChange={(e)=>setFilters({...filters, location:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Location" />
          <input value={filters.category} onChange={(e)=>setFilters({...filters, category:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Category" />
          <select value={filters.jobType} onChange={(e)=>setFilters({...filters, jobType:e.target.value})} className="w-full border rounded px-3 py-2">
            <option value="">Any Type</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
          <div className="flex gap-2">
            <input value={filters.minSalary} onChange={(e)=>setFilters({...filters, minSalary:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Min Salary" />
            <input value={filters.maxSalary} onChange={(e)=>setFilters({...filters, maxSalary:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Max Salary" />
          </div>
          <button onClick={()=>setPage(1)} className="btn-primary w-full">Find Job</button>
        </div>
      </aside>
      <section className="md:col-span-3 space-y-3">
        {data.jobs.map(j => (
          <Link key={j._id} to={`/jobs/${j._id}`} className="block bg-white p-4 rounded-md shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{j.title}</div>
                <div className="text-sm text-gray-600">{j.companyName} · {j.location}</div>
                <div className="text-sm mt-1">{j.jobType}{j.salary?` · $${j.salary}`:''}</div>
              </div>
              <div className="text-sm text-gray-500">{new Date(j.createdAt).toLocaleDateString()}</div>
            </div>
          </Link>
        ))}
        <div className="flex items-center gap-3 pt-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-2 rounded border">Prev</button>
          <span>Page {data.page || page}</span>
          <button disabled={(data.page||page)*data.limit>=data.total} onClick={()=>setPage(p=>p+1)} className="px-3 py-2 rounded border">Next</button>
        </div>
      </section>
    </div>
  )
}


