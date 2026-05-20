import { Kanban } from 'react-kanban-kit'

const columns = [
  { id: 'wishlist', title: 'Wishlist', type: 'status-wishlist' },
  { id: 'applied', title: 'Applied', type: 'status-applied' },
  { id: 'interviewing', title: 'Interviewing', type: 'status-interviewing' },
  { id: 'offer', title: 'Offer', type: 'status-offer' },
  { id: 'rejected', title: 'Rejected', type: 'status-rejected' },
]

const dataSource = {
  root: {
    id: 'root',
    title: 'root',
    parentId: null,
    children: columns.map(c => c.id),
    totalChildrenCount: columns.length,
    type: 'root',
  },
  ...Object.fromEntries(
    columns.map(col => [
      col.id,
      {
        id: col.id,
        title: col.title,
        parentId: 'root',
        children: [],
        totalChildrenCount: 0,
        type: col.type,
        content: { status: col.title },
      },
    ])
  ),
}

const configMap = Object.fromEntries(
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
)

export default function KanbanBoard() {
  return (
    <div className="h-full overflow-x-auto">
      <Kanban
        dataSource={dataSource}
        configMap={configMap}
        cardsGap={12}
      />
    </div>
  )
}
