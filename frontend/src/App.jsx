import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Jobs from './pages/Jobs.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import EmployerDashboard from './pages/EmployerDashboard.jsx'
import CandidateDashboard from './pages/CandidateDashboard.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function Nav() {
  const { user, logout } = useAuth()
  return (
    <nav className="bg-white shadow">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-semibold text-blue-700">Job Board</Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link to="/">Home</Link>
            <Link to="/jobs">Browse Job</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-sm text-blue-700">Log In</Link>
              <Link to={user?.role==='employer'?'/employer':'/employer'} className="btn-green">Post A Job</Link>
            </>
          ) : (
            <>
              {user.role === 'employer' ? (
                <Link to="/employer" className="btn-green">Post A Job</Link>
              ) : null}
              {user.role === 'employer' ? (
                <Link to="/employer" className="px-3 py-2 rounded border">Dashboard</Link>
              ) : (
                <Link to="/candidate" className="px-3 py-2 rounded border">Dashboard</Link>
              )}
              <button onClick={logout} className="px-3 py-2 rounded-md border">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employer" element={<ProtectedRoute role="employer"><EmployerDashboard /></ProtectedRoute>} />
            <Route path="/candidate" element={<ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
        <footer className="border-t bg-white"><div className="container py-6 text-sm text-gray-500">© {new Date().getFullYear()} JobBoard</div></footer>
      </div>
    </AuthProvider>
  )
}


