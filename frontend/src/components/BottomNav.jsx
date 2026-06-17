import { Bars3Icon, PlusIcon, BellIcon } from '@heroicons/react/24/outline'

function BottomNav({ onToggle, onAddJob, onToggleReminderDrawer, reminderCount }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-gray-700 z-50 flex items-center h-16 md:hidden" role="navigation" aria-label="Mobile navigation">
      {/* Menu button */}
      <button
        onClick={onToggle}
        className="flex flex-col items-center justify-center w-full py-1 px-2 text-sidebar-muted hover:text-white transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Bars3Icon className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-0.5">Menu</span>
      </button>

      {/* Add Job button */}
      <button
        onClick={onAddJob}
        className="flex flex-col items-center justify-center w-full py-1 px-2 text-sidebar-muted hover:text-white transition-colors cursor-pointer"
        aria-label="Add Job"
      >
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <PlusIcon className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] font-medium mt-0.5">Add Job</span>
      </button>

      {/* Reminders button */}
      <button
        onClick={onToggleReminderDrawer}
        className="flex flex-col items-center justify-center w-full py-1 px-2 text-sidebar-muted hover:text-white transition-colors cursor-pointer relative"
        aria-label="Follow-up Reminders"
      >
        <div className="relative">
          <BellIcon className="w-6 h-6" />
          {reminderCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {reminderCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium mt-0.5">Reminders</span>
      </button>
    </nav>
  )
}

export default BottomNav
