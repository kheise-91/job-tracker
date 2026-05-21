import { useMemo } from 'react'
import { Kanban } from 'react-kanban-kit'
import JobCard from './JobCard'

const columns = [
  { id: 'wishlist', title: 'Wishlist', type: 'status-wishlist' },
  { id: 'applied', title: 'Applied', type: 'status-applied' },
  { id: 'interviewing', title: 'Interviewing', type: 'status-interviewing' },
  { id: 'offer', title: 'Offer', type: 'status-offer' },
  { id: 'rejected', title: 'Rejected', type: 'status-rejected' },
]

const COLUMN_TO_STATUS = Object.fromEntries(
  columns.map(col => [col.id, col.title])
)

function buildDataSource(jobs) {
  const jobsByColumn = {}
  for (const col of columns) {
    jobsByColumn[col.id] = []
  }

  const cardNodes = {}
  for (const job of jobs) {
    const col = columns.find(c => c.title === job.status)
    if (!col) continue

    const cardId = `card-${job.id}`
    jobsByColumn[col.id].push(cardId)

    cardNodes[cardId] = {
      id: cardId,
      title: job.company,
      parentId: col.id,
      children: [],
      totalChildrenCount: 0,
      type: 'job-card',
      content: job,
    }
  }

  const columnNodes = Object.fromEntries(
    columns.map(col => [
      col.id,
      {
        id: col.id,
        title: col.title,
        parentId: 'root',
        children: jobsByColumn[col.id],
        totalChildrenCount: jobsByColumn[col.id].length,
        type: col.type,
        content: { status: col.id },
      },
    ])
  )

  return {
    root: {
      id: 'root',
      title: 'root',
      parentId: null,
      children: columns.map(c => c.id),
      totalChildrenCount: columns.length,
      type: 'root',
    },
    ...columnNodes,
    ...cardNodes,
  }
}

export default function KanbanBoard({ jobs, onStatusChange, onDeleteJob, onEditJob }) {
  const dataSource = useMemo(() => buildDataSource(jobs), [jobs])

  const configMap = useMemo(() => ({
    ...Object.fromEntries(
      columns.map(col => [
        col.type,
        {
          render: ({ data }) => (
            <div className="px-3 py-2 text-sm font-medium text-gray-700">
              {data.title || 'Untitled'}
            </div>
          ),
          isDraggable: false,
        },
      ])
    ),
    'job-card': {
      render: ({ data }) => {
        const job = data.content
        return (
          <JobCard
            job={job}
            onEdit={(job) => onEditJob?.(job)}
            onDelete={(jobId) => onDeleteJob(jobId)}
          />
        )
      },
      isDraggable: true,
    },
  }), [onDeleteJob])

  const handleCardMove = ({ cardId, toColumnId }) => {
    const jobId = parseInt(cardId.replace('card-', ''), 10)
    const newStatus = COLUMN_TO_STATUS[toColumnId]
    if (newStatus) {
      onStatusChange(jobId, newStatus)
    }
  }

  return (
    <div className="h-full overflow-x-auto">
      <Kanban
        dataSource={dataSource}
        configMap={configMap}
        cardsGap={10}
        onCardMove={handleCardMove}
        columnHeaderClassName={(column) =>
          `${column.content?.status || "default"}-status`
        }
        columnClassName={(column) =>
          `${column.content?.status || "default"}-status`
        }
      />
    </div>
  )
}
