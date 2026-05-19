import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

function Header({ searchValue, onSearchChange }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">Job Tracking Board</h1>
      <div className="relative">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </header>
  )
}

export default Header
