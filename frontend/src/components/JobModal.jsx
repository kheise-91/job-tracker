import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

const STATUSES = ['Wishlist', 'Applied', 'Followed Up', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn']

function JobModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    followed_up_date: null,
    interview_date: null,
    notes: '',
    hyperlink: '',
    source: '',
    salary: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        position: initialData.position || '',
        status: initialData.status || 'Applied',
        followed_up_date: initialData.followed_up_date
          ? initialData.followed_up_date.split(' ')[0]
          : '',
        interview_date: initialData.interview_date
          ? initialData.interview_date.replace(' ', 'T').slice(0, 16)
          : '',
        notes: initialData.notes || '',
        hyperlink: initialData.hyperlink || '',
        source: initialData.source || '',
        salary: initialData.salary || '',
      })
    } else {
      setFormData({
        company: '',
        position: '',
        status: 'Applied',
        followed_up_date: null,
        interview_date: null,
        notes: '',
        hyperlink: '',
        source: '',
        salary: '',
      })
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Use React state directly — FormData from DOM can be stale
    const dateFields = ['followed_up_date', 'interview_date']
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([k, v]) => v !== '' && (v !== null || dateFields.includes(k)))
    )
    onSubmit(payload)
  }

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
  const labelClass = 'block text-xs font-medium text-gray-700 mb-1'
  const sectionHeaderClass = 'text-sm font-semibold text-gray-600 border-b border-gray-200 pb-2 mb-3'

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex justify-center items-start md:items-center p-2 md:p-4">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-2xl bg-white rounded-xl shadow-2xl h-[90%] md:max-h-[95vh] overflow-hidden flex flex-col">
              {/* Fixed Header */}
              <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <DialogTitle className="text-lg md:text-xl font-bold text-gray-900">
                  {initialData ? 'Edit Job' : 'Add New Job'}
                </DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Scrollable Form Content */}
                <div className="overflow-y-auto px-4 md:px-6 py-4 md:py-6 flex-1">
                  <div className="space-y-4">
                    {/* Basic Information */}
                  <section>
                    <h3 className={sectionHeaderClass}>Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className={labelClass}>Company *</label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Acme Corp"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Position *</label>
                        <input
                          type="text"
                          required
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          placeholder="Software Engineer"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Salary</label>
                        <input
                          type="text"
                          value={formData.salary}
                          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                          placeholder="Annual/Hourly Pay"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Status *</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className={inputClass}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Dates */}
                  <section>
                    <h3 className={sectionHeaderClass}>Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className={labelClass}>Followed Up Date</label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={formData.followed_up_date || ''}
                            onChange={(e) => setFormData({ ...formData, followed_up_date: e.target.value })}
                            className={`${inputClass} flex-1`}
                          />
                          {formData.followed_up_date && (
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, followed_up_date: null })}
                              className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Interview Date</label>
                        <div className="flex gap-2">
                          <input
                            type="datetime-local"
                            value={formData.interview_date || ''}
                            onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                            className={`${inputClass} flex-1`}
                          />
                          {formData.interview_date && (
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, interview_date: null })}
                              className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Additional Details */}
                  <section>
                    <h3 className={sectionHeaderClass}>Additional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className={labelClass}>Source</label>
                        <input
                          type="text"
                          value={formData.source}
                          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                          placeholder="LinkedIn, Glassdoor, etc."
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Job Posting URL</label>
                        <input
                          type="url"
                          value={formData.hyperlink}
                          onChange={(e) => setFormData({ ...formData, hyperlink: e.target.value })}
                          placeholder="https://example.com/job/123"
                          className={inputClass}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className={labelClass}>Notes</label>
                        <textarea
                          rows={3}
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Any additional notes..."
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    </div>
                  </section>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="flex items-center justify-end gap-3 px-4 md:px-6 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-sm"
                  >
                    {initialData ? 'Save Changes' : 'Add Job'}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default JobModal
