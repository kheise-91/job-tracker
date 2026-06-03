import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline'

function Header({ searchValue, onSearchChange, onAddJob, onToggleReminderDrawer }) {
  return (
    <header className="bg-white border-b border-gray-200 mb-2 px-6 py-4 flex items-center justify-between">
      <div className="w-[30%]">
        <h1 className="text-xl font-semibold text-gray-800">Job Tracking Board</h1>
      </div>
      <div className="w-[40%]">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      <div className="w-[30%] flex justify-end gap-2">
        <button
          onClick={onToggleReminderDrawer}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark font-medium transition-colors cursor-pointer text-sm flex items-center gap-1"
        >
          <BellIcon className="w-5 h-5" />
          Follow-up Reminders
        </button>
        <button
          onClick={onAddJob}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark font-medium transition-colors cursor-pointer text-sm"
        >
          Add Job
        </button>
      </div>
    </header>
  )
}

export default Header
