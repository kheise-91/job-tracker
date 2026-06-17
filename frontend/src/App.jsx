import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import JobModal from './components/JobModal'
import JobProfileCard from './components/JobProfileCard'
import ReminderDrawer from './components/ReminderDrawer'

function computeReminders(jobs, today) {
  return jobs
    .filter(job => {
      const appliedDate = new Date(job.date_applied.replace(' ', 'T'))
      const diffDays = Math.floor((today - appliedDate) / (1000 * 60 * 60 * 24))
      return job.status === 'Applied' && diffDays >= 7 && diffDays <= 14 && !job.followed_up_date && !job.follow_up_dismissed
    })
    .map(job => ({
      ...job,
      daysAgo: Math.floor((today - new Date(job.date_applied.replace(' ', 'T'))) / (1000 * 60 * 60 * 24)),
    }))
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.matchMedia('(min-width: 1024px)').matches)
  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [profileCardOpen, setProfileCardOpen] = useState(false)
  const [viewingJob, setViewingJob] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const today = new Date()
  const reminders = computeReminders(jobs, today)

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs
    const q = searchQuery.toLowerCase()
    return jobs.filter(
      job =>
        (job.company || '').toLowerCase().includes(q) ||
        (job.position || '').toLowerCase().includes(q)
    )
  }, [jobs, searchQuery])

  useEffect(() => {
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => setSidebarOpen(e.matches))
  }, [])

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

  const handleViewJob = (job) => {
    setViewingJob(job)
    setProfileCardOpen(true)
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

  const handleDismissReminder = async (id) => {
    // Optimistic update — immediately mark dismissed so UI responds instantly
    setJobs(prev => prev.map(job =>
      job.id === id ? { ...job, follow_up_dismissed: 1 } : job
    ))
    try {
      await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_up_dismissed: true }),
      })
    } catch (err) {
      // Revert on failure so the reminder reappears
      setJobs(prev => prev.map(job =>
        job.id === id ? { ...job, follow_up_dismissed: 0 } : job
      ))
      console.error('Error dismissing reminder:', err)
    }
  }

  const handleDismissAllReminders = async () => {
    const reminderIds = reminders.map(r => r.id)
    // Optimistic update — immediately mark all dismissed so UI responds instantly
    setJobs(prev => prev.map(job =>
      reminderIds.includes(job.id) ? { ...job, follow_up_dismissed: 1 } : job
    ))
    try {
      await Promise.all(
        reminderIds.map(id =>
          fetch(`/api/jobs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ follow_up_dismissed: true }),
          })
        )
      )
    } catch (err) {
      // Revert on failure so the reminders reappear
      setJobs(prev => prev.map(job =>
        reminderIds.includes(job.id) ? { ...job, follow_up_dismissed: 0 } : job
      ))
      console.error('Error dismissing all reminders:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <aside className={`lg:hidden relative w-16 z-25`}></aside>
      <aside className={`${sidebarOpen ? 'w-72 absolute lg:relative' : 'w-16 absolute lg:relative'} transition-all duration-200 inset-0 z-50 overflow-hidden`}>
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
          reminderCount={reminders.length}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden px-6 pb-6">
            <KanbanBoard
              jobs={filteredJobs}
              onBoardUpdate={handleBoardUpdate}
              onDeleteJob={handleDeleteJob}
              onEditJob={handleEditJob}
              onViewJob={handleViewJob}
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

          <JobProfileCard
            isOpen={profileCardOpen}
            onClose={() => {
              setProfileCardOpen(false)
              setViewingJob(null)
            }}
            job={viewingJob}
          />

          <ReminderDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            reminders={reminders}
            reminderCount={reminders.length}
            onDismiss={handleDismissReminder}
            onDismissAll={handleDismissAllReminders}
            onViewJob={handleViewJob}
          />
        </main>
      </div>
    </div>
  )
}

export default App