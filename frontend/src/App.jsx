import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied'
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs')
      const data = await res.json()
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const newJob = await res.json()
      setJobs([...jobs, newJob])
      setFormData({ company: '', position: '', status: 'Applied' })
    } catch (error) {
      console.error('Error adding job:', error)
    }
  }

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const updatedJob = await res.json()
      setJobs(jobs.map(j => (j.id === jobId ? updatedJob : j)))
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  const handleDeleteJob = async (jobId) => {
    try {
      await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' })
      setJobs(jobs.filter(j => j.id !== jobId))
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-16'} flex-shrink-0 transition-all duration-200`}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchValue={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-6 pb-4 shrink-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Position"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors">
                Add Job
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-hidden px-6 pb-6">
            <KanbanBoard jobs={jobs} onStatusChange={handleStatusChange} onDeleteJob={handleDeleteJob} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
