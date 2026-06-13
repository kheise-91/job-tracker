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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6">
              <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
                {initialData ? 'Edit Job' : 'Add New Job'}
              </DialogTitle>

              <form onSubmit={handleSubmit} className="space-y-4 leading-none text-[90%]">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="Annual/Hourly Pay"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Followed Up Date</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={formData.followed_up_date || ''}
                      onChange={(e) => setFormData({ ...formData, followed_up_date: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.followed_up_date && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, followed_up_date: null })}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
                  <div className="flex gap-2">
                    <input
                      type="datetime-local"
                      value={formData.interview_date || ''}
                      onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.interview_date && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, interview_date: null })}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="LinkedIn, Glassdoor, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Posting URL</label>
                  <input
                    type="url"
                    value={formData.hyperlink}
                    onChange={(e) => setFormData({ ...formData, hyperlink: e.target.value })}
                    placeholder="https://example.com/job/123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-[90px]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark font-medium transition-colors cursor-pointer"
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
