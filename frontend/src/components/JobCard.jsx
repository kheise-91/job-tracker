import { LinkIcon, PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

function formatInterviewDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr.replace(' ', 'T'))
  if (isNaN(date)) return ''
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${month} ${day}, ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

function JobCard({ job, status, onEdit, onDelete }) {
  const interviewDate = status === 'Interviewing' && job.interview_date
    ? formatInterviewDate(job.interview_date)
    : ''
  const [showNotes, setShowNotes] = useState(false)

  const handleMouseEnter = () => setShowNotes(true)
  const handleMouseLeave = () => setShowNotes(false)
  const handleTap = (e) => {
    e.stopPropagation()
    setShowNotes(!showNotes)
  }

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer relative">
      {interviewDate && (
        <div className="absolute top-2 right-2 text-xs font-medium rounded text-interview-status bg-interview-status-light  px-1.5 py-0.5">
          {interviewDate}
        </div>
      )}
      <div className={`font-semibold text-gray-800 text-sm ${interviewDate ? 'pr-16' : ''}`}>{job.company}</div>
      <div className={`text-gray-500 text-xs mt-0.5 ${interviewDate ? 'pr-16' : ''}`}>{job.position}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center">
          {job.notes && (
            <div className="relative">
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleTap}
                className="p-0.5 rounded cursor-pointer text-gray-400 hover:text-accent-dark transition-colors"
                aria-label="View notes"
              >
                <InformationCircleIcon className="w-4 h-4" />
              </button>
              <div
                className={`absolute bottom-full left-0 mb-2 w-64 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg z-10 transition-opacity duration-200 ${showNotes ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="whitespace-pre-wrap">{job.notes}</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {job.hyperlink && (
            <a
              href={job.hyperlink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation(); }}
              className="p-0.5 rounded cursor-pointer text-gray-400 hover:text-accent-dark transition-colors"
              aria-label="View job posting"
            >
              <LinkIcon className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(job) }}
            className="p-0.5 rounded cursor-pointer text-gray-400 hover:text-accent-dark transition-colors"
            aria-label="Edit job"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(job.id) }}
            className="p-0.5 rounded cursor-pointer text-gray-400 hover:text-secondary-dark transition-colors"
            aria-label="Delete job"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobCard
