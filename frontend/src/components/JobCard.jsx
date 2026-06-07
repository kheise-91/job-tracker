import { LinkIcon, PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

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

function formatFollowedUpDate(dateStr) {
  if (!dateStr) return ''
  // Parse as local date to avoid UTC timezone shift (date-only strings like "2026-05-27"
  // are interpreted as UTC midnight, which shifts to the previous day in negative UTC timezones)
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  if (isNaN(date)) return ''
  const m = date.toLocaleString('en-US', { month: 'short' })
  return `${m} ${day}`
}

function JobCard({ job, status, onEdit, onDelete, onView }) {
  const interviewDate = status === 'Interviewing' && job.interview_date
    ? formatInterviewDate(job.interview_date)
    : ''
  const followedUpDate = status === 'Followed Up' && job.followed_up_date
    ? formatFollowedUpDate(job.followed_up_date)
    : ''
  const [showNotes, setShowNotes] = useState(false)
  const buttonRef = useRef(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  // Calculate tooltip position relative to viewport when tooltip opens
  useEffect(() => {
    if (showNotes && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top - 8, // 8px gap above button
        left: rect.left + rect.width / 2, // center horizontally on button
      })
    }
  }, [showNotes])

  const handleMouseEnter = () => setShowNotes(true)
  const handleMouseLeave = () => setShowNotes(false)
  const handleTap = (e) => {
    e.stopPropagation()
    setShowNotes(!showNotes)
  }

  return (
    <div
      className="group bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer relative"
      onClick={() => onView(job)}
    >
      {interviewDate && (
        <div className="absolute top-2 right-2 text-xs font-medium rounded text-interview-status bg-interview-status-light px-1.5 py-0.5">
          {interviewDate}
        </div>
      )}
      {followedUpDate && (
        <div className="absolute top-2 right-2 text-xs font-medium rounded text-followed-up-status bg-followed-up-status-light px-1.5 py-0.5">
          {followedUpDate}
        </div>
      )}
      <div className={`font-semibold text-gray-800 text-sm ${interviewDate || followedUpDate ? 'pr-16' : ''}`}>{job.company}</div>
      <div className={`text-gray-500 text-xs mt-0.5 ${interviewDate || followedUpDate ? 'pr-16' : ''}`}>{job.position}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center">
          {job.notes && (
            <div className="relative inline-block">
              <button
                ref={buttonRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleTap}
                className="p-0.5 rounded cursor-pointer text-gray-400 hover:text-accent-dark transition-colors"
                aria-label="View notes"
              >
                <InformationCircleIcon className="w-4 h-4" />
              </button>

              {/* Tooltip rendered via portal — escapes all overflow: hidden parents */}
              {showNotes && createPortal(
                <div
                  className="fixed w-max max-w-[250px] bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg z-[9999] transition-opacity duration-200 whitespace-pre-wrap pointer-events-auto"
                  style={{
                    top: tooltipPosition.top,
                    left: tooltipPosition.left,
                    transform: 'translate(-50%, -100%)',
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {job.notes}
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-800 rotate-45" />
                </div>,
                document.body
              )}
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
