import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import JobModal from './components/JobModal'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

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

  const handleAddJob = () => {
    setEditingJob(null)
    setModalOpen(true)
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
    setModalOpen(true)
  }

  const handleModalSubmit = async (data) => {
    try {
      if (editingJob) {
        const res = await fetch(`/api/jobs/${editingJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const updatedJob = await res.json()
        setJobs(jobs.map(j => (j.id === updatedJob.id ? updatedJob : j)))
      } else {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const newJob = await res.json()
        setJobs([...jobs, newJob])
      }
      setModalOpen(false)
      setEditingJob(null)
    } catch (error) {
      console.error('Error saving job:', error)
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
            <button
              onClick={handleAddJob}
              className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark font-medium transition-colors cursor-pointer"
            >
              Add Job
            </button>
          </div>

          <div className="flex-1 overflow-hidden px-6 pb-6">
            <KanbanBoard
              jobs={jobs}
              onStatusChange={handleStatusChange}
              onDeleteJob={handleDeleteJob}
              onEditJob={handleEditJob}
            />
          </div>

          <JobModal
            isOpen={modalOpen}
            onClose={() => { setModalOpen(false); setEditingJob(null) }}
            onSubmit={handleModalSubmit}
            initialData={editingJob}
          />
        </main>
      </div>
    </div>
  )
}

export default App
