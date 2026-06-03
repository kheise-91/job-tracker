import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import JobModal from './components/JobModal'
import ReminderDrawer from './components/ReminderDrawer'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs')
      const data = await res.json()
      setJobs(data)
    } catch (err) {
      console.error('Error fetching jobs:', err)
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        const updatedJob = await res.json()

        setJobs(prev =>
          prev.map(job =>
            job.id === updatedJob.id
              ? updatedJob
              : job
          )
        )
      } else {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        const newJob = await res.json()

        setJobs(prev => [...prev, newJob])
      }

      setModalOpen(false)
      setEditingJob(null)
    } catch (err) {
      console.error('Error saving job:', err)
    }
  }

  const handleDeleteJob = async (jobId) => {
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      })

      setJobs(prev => prev.filter(job => job.id !== jobId))
    } catch (err) {
      console.error('Error deleting job:', err)
    }
  }

  const handleBoardUpdate = (updatedJobs) => {
    setJobs(updatedJobs)
  }

  const handleToggleReminderDrawer = () => {
    setDrawerOpen(prev => !prev)
  }

  const handleDismissReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const handleDismissAllReminders = () => {
    setReminders([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-16'} flex-shrink-0 transition-all duration-200`}>
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onAddJob={handleAddJob}
          onToggleReminderDrawer={handleToggleReminderDrawer}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden px-6 pb-6">
            <KanbanBoard
              jobs={jobs}
              onBoardUpdate={handleBoardUpdate}
              onDeleteJob={handleDeleteJob}
              onEditJob={handleEditJob}
            />
          </div>

          <JobModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false)
              setEditingJob(null)
            }}
            onSubmit={handleModalSubmit}
            initialData={editingJob}
          />

          <ReminderDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            reminders={reminders}
            onDismiss={handleDismissReminder}
            onDismissAll={handleDismissAllReminders}
          />
        </main>
      </div>
    </div>
  )
}

export default App