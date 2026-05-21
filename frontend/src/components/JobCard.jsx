import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

function JobCard({ job, onEdit, onDelete }) {
  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="font-semibold text-gray-800 text-sm">{job.company}</div>
      <div className="text-gray-500 text-xs mt-0.5">{job.position}</div>
      <div className="mt-2 flex items-center justify-between">
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
