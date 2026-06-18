import { MagnifyingGlassIcon, BellIcon, PlusIcon } from '@heroicons/react/24/outline'

function Header({ searchValue, onSearchChange, onAddJob, onToggleReminderDrawer, reminderCount }) {
  return (
    <header className="bg-white border-b border-gray-200 mb-2 px-6 py-4 flex items-center justify-between">
      <div className="hidden md:block w-[30%]">
        <h1 className="text-xl font-semibold text-gray-800">Job Tracking Board</h1>
      </div>
      <div className="hidden xl:block w-[40%]">
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
      <div className="w-[100%] md:w-[66%] xl:w-[30%] flex items-center justify-end gap-2">
        {/* Search bar — visible only below 1200px, positioned first in third column */}
        <div className="relative xl:hidden flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        {/* Reminders button — icon only below 1200px, full button at desktop */}
        <button
          onClick={onToggleReminderDrawer}
          className="hidden md:flex bg-primary text-white rounded-md hover:bg-primary-dark font-medium transition-colors cursor-pointer text-sm flex items-center justify-center gap-1 xl:px-4 xl:py-2 p-2"
        >
          <BellIcon className="w-5 h-5 flex-shrink-0" />
          <span className="hidden xl:inline">Reminders</span>
          <span className="hidden xl:inline bg-primary-darkest text-white text-xs rounded ml-3 px-2 py-1">
            {reminderCount}
          </span>
        </button>
        {/* Add Job button — icon only below 1200px, full button at desktop */}
        <button
          onClick={onAddJob}
          className="hidden md:flex bg-primary text-white rounded-md hover:bg-primary-dark font-medium transition-colors cursor-pointer text-sm flex items-center justify-center gap-1 xl:px-4 xl:py-[10px] p-2"
        >
          <PlusIcon className="w-5 h-5 flex-shrink-0" />
          <span className="hidden xl:inline">Add Job</span>
        </button>
      </div>
    </header>
  )
}

export default Header
