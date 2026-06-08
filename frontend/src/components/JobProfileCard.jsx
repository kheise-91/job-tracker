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

const statusGradient = {
  'Wishlist': 'linear-gradient(to right, var(--color-wishlist-status), color-mix(in srgb, var(--color-wishlist-status) 85%, black))',
  'Applied': 'linear-gradient(to right, var(--color-applied-status), color-mix(in srgb, var(--color-applied-status) 85%, black))',
  'Followed Up': 'linear-gradient(to right, var(--color-followed-up-status), color-mix(in srgb, var(--color-followed-up-status) 85%, black))',
  'Interviewing': 'linear-gradient(to right, var(--color-interviewing-status), color-mix(in srgb, var(--color-interviewing-status) 85%, black))',
  'Offer': 'linear-gradient(to right, var(--color-offer-status), color-mix(in srgb, var(--color-offer-status) 85%, black))',
  'Rejected': 'linear-gradient(to right, var(--color-rejected-status), color-mix(in srgb, var(--color-rejected-status) 85%, black))',
}

const statusBadgeStyle = {
  'Wishlist': { backgroundColor: 'var(--color-wishlist-status-light)', color: 'var(--color-wishlist-status)', borderColor: 'color-mix(in srgb, var(--color-wishlist-status) 50%, var(--color-wishlist-status-light))' },
  'Applied': { backgroundColor: 'var(--color-applied-status-light)', color: 'var(--color-applied-status)', borderColor: 'color-mix(in srgb, var(--color-applied-status) 50%, var(--color-applied-status-light))' },
  'Followed Up': { backgroundColor: 'var(--color-followed-up-status-light)', color: 'var(--color-followed-up-status)', borderColor: 'color-mix(in srgb, var(--color-followed-up-status) 50%, var(--color-followed-up-status-light))' },
  'Interviewing': { backgroundColor: 'var(--color-interviewing-status-light)', color: 'var(--color-interviewing-status)', borderColor: 'color-mix(in srgb, var(--color-interviewing-status) 50%, var(--color-interviewing-status-light))' },
  'Offer': { backgroundColor: 'var(--color-offer-status-light)', color: 'var(--color-offer-status)', borderColor: 'color-mix(in srgb, var(--color-offer-status) 50%, var(--color-offer-status-light))' },
  'Rejected': { backgroundColor: 'var(--color-rejected-status-light)', color: 'var(--color-rejected-status)', borderColor: 'color-mix(in srgb, var(--color-rejected-status) 50%, var(--color-rejected-status-light))' },
}

function defaultBadgeStyle() {
  return { backgroundColor: '#f5f5f5', color: '#757575', borderColor: '#e0e0e0' }
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
        <div
          className="px-6 py-5"
          style={{ background: statusGradient[job.status] || 'linear-gradient(to right, #555, #333)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div id="profile-card-title" className="text-xl font-bold text-white">
                {job.company}
              </div>
              <div className="text-sm text-gray-200 mt-1">{job.position}</div>
            </div>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
              style={statusBadgeStyle[job.status] || defaultBadgeStyle()}
            >
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
            <div className="text-sm text-gray-900 leading-relaxed bg-gray-50 rounded-md p-3 whitespace-pre-wrap">
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
