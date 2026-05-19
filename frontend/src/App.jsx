import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

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

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-16'} flex-shrink-0 transition-all duration-200`}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchValue={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
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

            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                  <h3 className="text-base font-medium">{job.company} — {job.position}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize
                    ${job.status === 'Applied' ? 'bg-blue-100 text-blue-700' : ''}
                    ${job.status === 'Interviewing' ? 'bg-orange-100 text-orange-700' : ''}
                    ${job.status === 'Offer' ? 'bg-green-100 text-green-700' : ''}
                    ${job.status === 'Rejected' ? 'bg-red-100 text-red-700' : ''}
                    ${job.status === 'Wishlist' ? 'bg-purple-100 text-purple-700' : ''}
                  `}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
