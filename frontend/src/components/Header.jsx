import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

function Header({ searchValue, onSearchChange, onAddJob }) {
  return (
    <header className="bg-white border-b border-gray-200 mb-2 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">Job Tracking Board</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
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
