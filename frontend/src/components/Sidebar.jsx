import { Bars3Icon, XMarkIcon, HomeIcon, CalendarDaysIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

function Sidebar({ isOpen, onToggle, hideOldApplications, onHideOldApplicationsChange }) {
  return (
    <div className="bg-sidebar text-white flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b-3 border-secondary-dark">
        <div className="flex items-center gap-2">
          {isOpen && (<img src="/pwa-512x512.png" alt="ATS" className="nav-logo size-15 rounded" />)}
          {isOpen && (
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold whitespace-nowrap">Job Tracker</span>
              <span className="text-[12px] text-sidebar-muted whitespace-nowrap">Application Tracking System</span>
            </div>
          )}
        </div>
        {isOpen ? 
          <button
            onClick={onToggle}
            className="p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors ml-auto"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          ><XMarkIcon className="w-5 h-5" />
          </button> 
        : 
          <button
            onClick={onToggle}
            className="p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors ml-auto mt-1 mb-1 mr-2"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          ><Bars3Icon className="w-5 h-5" /></button>
          }
      </div>

      <nav className="flex flex-col flex-1 p-2 overflow-y-auto">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary-dark hover:bg-accent transition-colors"
        >
          <HomeIcon className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="whitespace-nowrap">Job Tracking Board</span>}
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent-dark transition-colors"
        >
          <CalendarDaysIcon className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="whitespace-nowrap">Interview Prep</span>}
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent-dark transition-colors"
        >
          <AcademicCapIcon className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="whitespace-nowrap">Resources</span>}
        </a>

        {/* Spacer to push Filters to bottom */}
        <div className="flex-1"></div>

        {/* Filters Section - Only visible when sidebar is expanded, pinned at bottom */}
        {isOpen && (
          <div className="mt-auto">
            <h3 className="px-1 text-xs font-semibold text-sidebar-muted uppercase tracking-wider border-t border-gray-700 mb-3 pt-4">Filters</h3>

            {/* Hide Old Applications Toggle */}
            <div className="py-2 px-2">
              <label className="flex items-center justify-between cursor-pointer group gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white group-hover:text-gray-100 transition-colors">Hide old applications</span>
                  <p className="text-xs text-sidebar-muted mt-1 leading-tight">Hides jobs in 'Applied' status that are older than 30 days</p>
                </div>

                {/* Switch Toggle */}
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    id="hideOldToggle"
                    className="sr-only peer"
                    checked={hideOldApplications}
                    onChange={(e) => onHideOldApplicationsChange(e.target.checked)}
                  />
                  <div className="w-12 h-6 bg-gray-600 rounded-full peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary transition-colors toggle-switch"></div>
                  <div className="absolute left-1 w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                </div>
              </label>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Sidebar
