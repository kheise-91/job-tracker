import { useEffect } from 'react'
import {
  CalendarIcon,
  BellIcon,
  UserIcon,
  NewspaperIcon,
  LinkIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr.replace(' ', 'T'))
  if (isNaN(date)) return ''
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

function formatDateTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr.replace(' ', 'T'))
  if (isNaN(date)) return ''
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${month} ${day}, ${year} at ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

function displayValue(val) {
  if (!val || (typeof val === 'string' && val.trim() === '')) {
    return <em className="text-gray-400">Not Set</em>
  }
  return val
}

function statusBadgeColor(status) {
  const colors = {
    'Wishlist': 'bg-teal-500/20 text-teal-200 border-teal-400/30',
    'Applied': 'bg-blue-500/20 text-blue-200 border-blue-400/30',
    'Followed Up': 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30',
    'Interviewing': 'bg-orange-500/20 text-orange-200 border-orange-400/30',
    'Offer': 'bg-green-500/20 text-green-200 border-green-400/30',
    'Rejected': 'bg-red-500/20 text-red-200 border-red-400/30',
    'Withdrawn': 'bg-gray-500/20 text-gray-200 border-gray-400/30',
  }
  return colors[status] || 'bg-gray-500/20 text-gray-200 border-gray-400/30'
}

export default function JobProfileCard({ job, isOpen, onClose }) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !job) return null

  const dateApplied = job.date_applied ? formatDate(job.date_applied) : null
  const followedUp = job.followed_up_date ? formatDate(job.followed_up_date) : null
  const interviewDate = job.interview_date ? formatDateTime(job.interview_date) : null
  const source = job.source || null
  const hyperlink = job.hyperlink || null
  const notes = job.notes || null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-card-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <div id="profile-card-title" className="text-xl font-bold text-white">
                {job.company}
              </div>
              <div className="text-sm text-gray-200 mt-1">{job.position}</div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeColor(job.status)}`}>
              {job.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Two-column field grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {/* Date Applied */}
            <div className="flex items-start gap-2.5">
              <CalendarIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Date Applied</div>
                <div className="text-sm text-gray-900 mt-0.5">
                  {displayValue(dateApplied)}
                </div>
              </div>
            </div>

            {/* Followed Up */}
            <div className="flex items-start gap-2.5">
              <BellIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Followed Up</div>
                <div className="text-sm text-gray-900 mt-0.5">
                  {displayValue(followedUp)}
                </div>
              </div>
            </div>

            {/* Interview Date */}
            <div className="flex items-start gap-2.5">
              <UserIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Interview Date</div>
                <div className="text-sm text-gray-900 mt-0.5">
                  {displayValue(interviewDate)}
                </div>
              </div>
            </div>

            {/* Source */}
            <div className="flex items-start gap-2.5">
              <NewspaperIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Source</div>
                <div className="text-sm text-gray-900 mt-0.5">
                  {displayValue(source)}
                </div>
              </div>
            </div>

            {/* Hyperlink (full width) */}
            <div className="flex items-start gap-2.5 col-span-2">
              <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs text-gray-500 font-medium">Hyperlink</div>
                <div className="text-sm mt-0.5">
                  {hyperlink
                    ? (
                      <a
                        href={hyperlink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent-dark underline break-all"
                      >
                        {hyperlink}
                      </a>
                    )
                    : displayValue(null)
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-5 pt-5 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <PencilIcon className="w-4 h-4 text-gray-400" />
              <div className="text-xs text-gray-500 font-medium">Notes</div>
            </div>
            <div className="text-sm text-gray-900 leading-relaxed bg-gray-50 rounded-md p-3">
              {displayValue(notes)}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-5 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
            >
              <XMarkIcon className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
