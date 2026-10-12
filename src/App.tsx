import { Plus } from 'lucide-react'
import { useState } from 'react'
import { BoardView } from './components/BoardView'
import { NewTaskDialog } from './components/NewTaskDialog'
import { Toast } from './components/ui'
import { useBoard } from './hooks/useBoard'
import { COLUMNS, NO_FILTERS } from './lib/types'
import type { Status } from './lib/types'

export default function App() {
  const board = useBoard()
  const [newTaskStatus, setNewTaskStatus] = useState<Status | null>(null)

  if (board.phase === 'error') {
    return (
      <div className="screen">
        <h1>The board could not load</h1>
        <p>{board.error}</p>
        <button type="button" className="button button-primary" onClick={board.retry}>
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-row">
          <div className="brand">
            <span className="brand-mark" aria-hidden>
              <i /><i /><i /><i />
            </span>
            <h1>Relay</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="button button-primary" onClick={() => setNewTaskStatus('todo')}>
              <Plus size={16} />
              New task
            </button>
          </div>
        </div>
      </header>

      {board.phase === 'loading' ? (
        <BoardSkeleton />
      ) : (
        <>
          {board.tasks.length === 0 && (
            <div className="welcome">
              <div>
                <h2>Your board is empty</h2>
                <p>Add your first task, or load a few sample tasks to see how the board works.</p>
              </div>
              <button type="button" className="button" onClick={board.addSamples}>
                Add sample tasks
              </button>
              <button type="button" className="button button-primary" onClick={() => setNewTaskStatus('todo')}>
                New task
              </button>
            </div>
          )}
          {/* Opening a task does nothing yet. The task panel arrives in the next chunk. */}
          <BoardView board={board} filters={NO_FILTERS} onOpen={() => {}} onAdd={setNewTaskStatus} />
        </>
      )}

      {newTaskStatus && <NewTaskDialog board={board} status={newTaskStatus} onClose={() => setNewTaskStatus(null)} />}
      {board.notice && <Toast message={board.notice} onDismiss={board.dismissNotice} />}
    </div>
  )
}

/** Placeholder columns shown while the first load is in flight. */
function BoardSkeleton() {
  return (
    <main className="board" aria-busy="true" aria-label="Loading your board">
      {COLUMNS.map((column, index) => (
        <section key={column.id} className={`column status-${column.id}`}>
          <header className="column-head">
            <span className="status-dot" />
            <h2>{column.title}</h2>
          </header>
          <div className="column-list">
            {Array.from({ length: 3 - (index % 3) }, (_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
