import { useEffect, useMemo, useState } from 'react'
import { Kanban } from 'react-kanban-kit'
import JobCard from './JobCard'

const columns = [
  { id: 'wishlist', title: 'Wishlist', type: 'status-wishlist' },
  { id: 'applied', title: 'Applied', type: 'status-applied' },
  { id: 'interviewing', title: 'Interviewing', type: 'status-interviewing' },
  { id: 'offer', title: 'Offer', type: 'status-offer' },
  { id: 'rejected', title: 'Rejected', type: 'status-rejected' },
]

function buildDataSource(jobs) {
  const cardNodes = {}
  const columnNodes = {}

  for (const column of columns) {
    const sortedJobs = jobs
      .filter(job => job.status === column.title)
      .sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order
        }

        return a.id - b.id
      })

    const children = []

    for (const job of sortedJobs) {
      const cardId = `card-${job.id}`

      children.push(cardId)

      cardNodes[cardId] = {
        id: cardId,
        title: job.company,
        parentId: column.id,
        children: [],
        totalChildrenCount: 0,
        type: 'job-card',
        content: job,
      }
    }

    columnNodes[column.id] = {
      id: column.id,
      title: column.title,
      parentId: 'root',
      children,
      totalChildrenCount: children.length,
      type: column.type,
      content: {
        status: column.id,
      },
    }
  }

  return {
    root: {
      id: 'root',
      title: 'root',
      parentId: null,
      children: columns.map(column => column.id),
      totalChildrenCount: columns.length,
      type: 'root',
    },
    ...columnNodes,
    ...cardNodes,
  }
}

function dataSourceToJobs(dataSource, existingJobs) {
  const updatedJobs = []

  for (const column of columns) {
    const columnData = dataSource[column.id]

    if (!columnData) {
      continue
    }

    columnData.children.forEach((cardId, index) => {
      const numericId = parseInt(cardId.replace('card-', ''), 10)

      const existingJob = existingJobs.find(job => job.id === numericId)

      if (!existingJob) {
        return
      }

      updatedJobs.push({
        ...existingJob,
        status: column.title,
        order: index,
      })
    })
  }

  return updatedJobs
}

export default function KanbanBoard({
  jobs,
  onBoardUpdate,
  onDeleteJob,
  onEditJob,
}) {
  const dataSource = useMemo(() => {
    return buildDataSource(jobs)
  }, [jobs])

  const configMap = useMemo(() => ({
    ...Object.fromEntries(
      columns.map(column => [
        column.type,
        {
          render: ({ data }) => (
            <div className="px-3 py-2 text-sm font-medium text-gray-700">
              {data.title}
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
            status={job.status}
            onEdit={onEditJob}
            onDelete={onDeleteJob}
          />
        )
      },
      isDraggable: true,
    },
  }), [onDeleteJob, onEditJob])

  const persistBoardState = async (updatedJobs) => {
    const payload = {
      columns: {},
    }

    for (const column of columns) {
      payload.columns[column.id] = updatedJobs
        .filter(job => job.status === column.title)
        .sort((a, b) => a.order - b.order)
        .map(job => job.id)
    }

    await fetch('/api/jobs/reorder', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  const handleCardMove = async ({
    cardId,
    fromColumnId,
    toColumnId,
    position,
  }) => {
    try {
      const jobId = parseInt(cardId.replace('card-', ''), 10)

      // Clone current jobs
      const updatedJobs = [...jobs]

      // Find moved job
      const movedJobIndex = updatedJobs.findIndex(
        job => job.id === jobId
      )

      if (movedJobIndex === -1) {
        return
      }

      const movedJob = {
        ...updatedJobs[movedJobIndex],
      }

      // Remove moved job from original list
      updatedJobs.splice(movedJobIndex, 1)

      // Update status if moved across columns
      const targetColumn = columns.find(
        col => col.id === toColumnId
      )

      movedJob.status = targetColumn.title

      // Get target column jobs WITHOUT moved job
      const targetJobs = updatedJobs
        .filter(job => job.status === movedJob.status)
        .sort((a, b) => a.order - b.order)

      // Insert at exact position
      targetJobs.splice(position, 0, movedJob)

      // Re-number orders correctly
      targetJobs.forEach((job, index) => {
        job.order = index
      })

      // If cross-column move, resequence source column too
      if (fromColumnId !== toColumnId) {
        const sourceColumn = columns.find(
          col => col.id === fromColumnId
        )

        const sourceJobs = updatedJobs
          .filter(job => job.status === sourceColumn.title)
          .sort((a, b) => a.order - b.order)

        sourceJobs.forEach((job, index) => {
          job.order = index
        })
      }

      // Replace moved job
      updatedJobs.push(...targetJobs.filter(
        tj => !updatedJobs.some(j => j.id === tj.id)
      ))

      // Update React state immediately
      onBoardUpdate(updatedJobs)

      // Persist backend
      const payload = {
        columns: {},
      }

      for (const column of columns) {
        payload.columns[column.id] = updatedJobs
          .filter(job => job.status === column.title)
          .sort((a, b) => a.order - b.order)
          .map(job => job.id)
      }

      await fetch('/api/jobs/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.error('Error moving card:', err)
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
          `${column.content?.status || 'default'}-status`
        }
      />
    </div>
  )
}