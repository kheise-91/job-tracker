import { Bars3Icon, XMarkIcon, HomeIcon, CalendarDaysIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

function Sidebar({ isOpen, onToggle }) {
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

      <nav className="flex-1 p-2">
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
      </nav>
    </div>
  )
}

export default Sidebar
