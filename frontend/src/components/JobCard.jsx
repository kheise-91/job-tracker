import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

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

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer relative">
      {interviewDate && (
        <div className="absolute top-2 right-2 text-xs font-medium rounded text-interview-status bg-interview-status-light  px-1.5 py-0.5">
          {interviewDate}
        </div>
      )}
      <div className={`font-semibold text-gray-800 text-sm ${interviewDate ? 'pr-16' : ''}`}>{job.company}</div>
      <div className={`text-gray-500 text-xs mt-0.5 ${interviewDate ? 'pr-16' : ''}`}>{job.position}</div>
      <div className={`mt-2 flex items-center justify-between `}>
        <span className="inline-block">

        </span>
        <div className="flex gap-1">
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
