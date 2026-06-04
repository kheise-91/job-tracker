import { useEffect, useState, useCallback } from 'react';
import { BellIcon, XMarkIcon, CheckCircleIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

function ReminderDrawer({ isOpen, onClose, reminders, reminderCount, onDismiss, onDismissAll }) {
  const [expanded, setExpanded] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) onClose();
  }, [isOpen, onClose]);

  useEffect(() => {
    // Reset expand state when drawer opens
    setExpanded(false);
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const reminderList = reminders ?? [];
  const MAX_VISIBLE = 5;
  const visibleReminders = expanded ? reminderList : reminderList.slice(0, MAX_VISIBLE);
  const hasMore = reminderList.length > MAX_VISIBLE;
  const remainingCount = reminderList.length - MAX_VISIBLE;

  // Format date using the project's existing pattern (see JobCard.jsx formatFollowedUpDate)
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split(' ')[0].split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date)) return '';
    const m = date.toLocaleString('en-US', { month: 'short' });
    return `${m} ${day}`;
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[100] transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel */}
      <div
        className="fixed top-0 right-0 h-full w-96 z-[110] bg-white shadow-2xl border-l border-gray-200 flex flex-col transition-transform duration-200 ease-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Follow-up Reminders"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <BellIcon className="w-5 h-5 text-primary flex-shrink-0" />
            <h2 className="text-base font-semibold text-gray-800 truncate">
              Follow-up Reminders
            </h2>
          </div>
          <button
            className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors flex-shrink-0 cursor-pointer"
            onClick={onDismissAll}
            disabled={reminderCount === 0}
          >
            Dismiss All
          </button>
        </div>

        {/* Reminder List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {reminderList.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircleIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                No pending follow-up reminders.
              </p>
            </div>
          ) : (
            <>
              {visibleReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <BriefcaseIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-gray-800 text-sm truncate">
                        {reminder.company} - {reminder.position}
                      </span>
                      <button
                        className="flex-shrink-0 p-1 rounded text-gray-300 hover:text-[#ce3a50] hover:bg-red-50 transition-colors"
                        onClick={() => onDismiss(reminder.id)}
                        title="Dismiss reminder"
                        aria-label={`Dismiss reminder for ${reminder.company} - ${reminder.position}`}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">
                      Applied {formatDate(reminder.date_applied)} &middot; {reminder.daysAgo} days ago
                    </p>
                  </div>
                </div>
              ))}
              {hasMore && (
                <div className="text-center pt-1 pb-1">
                  {!expanded ? (
                    <button
                      className="text-sm font-medium text-primary hover:text-primary-dark cursor-pointer transition-colors"
                      onClick={() => setExpanded(true)}
                    >
                      + {remainingCount} more
                    </button>
                  ) : (
                    <button
                      className="text-sm font-medium text-primary hover:text-primary-dark cursor-pointer transition-colors"
                      onClick={() => setExpanded(false)}
                    >
                      Show less
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex-shrink-0">
          <button
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

export default ReminderDrawer;
