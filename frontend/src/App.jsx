import { useState, useEffect } from 'react'

function App() {
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

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <h1>Job Tracker</h1>
      
      <form onSubmit={handleSubmit} className="job-form">
        <input
          type="text"
          placeholder="Company"
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={formData.position}
          onChange={(e) => setFormData({...formData, position: e.target.value})}
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit">Add Job</button>
      </form>

      <div className="jobs-list">
        {jobs.map(job => (
          <div key={job.id} className="job-card">
            <h3>{job.company} - {job.position}</h3>
            <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App