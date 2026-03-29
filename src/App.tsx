import { useState } from 'react'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { useTaskManager } from './useTaskManager'

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { tasks, idPrefix, setIdPrefix, nextId, isLoading, addTask, updateTaskStatus, deleteTask } = useTaskManager()

  if (isLoading) {
    return (
      <div className="app-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="app-title">Task Board</h1>
          <p style={{ color: '#505860', fontSize: '0.75rem', letterSpacing: '0.2em', marginTop: '8px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-root">
      {/* Ambient gradient orbs */}
      <div className="app-orb">
        <div style={{
          position: 'absolute', top: '-20%', left: '-12%',
          width: '55%', height: '55%',
          background: 'radial-gradient(circle at center, rgba(120,120,130,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-8%',
          width: '45%', height: '50%',
          background: 'radial-gradient(circle at center, rgba(100,110,105,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', top: '35%', right: '20%',
          width: '30%', height: '35%',
          background: 'radial-gradient(circle at center, rgba(90,90,100,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="app-content">
        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">Task Board</h1>
          <p className="app-subtitle">Smart Task Management</p>
        </header>

        <TaskList
          tasks={tasks}
          onTaskStatusChange={updateTaskStatus}
          onTaskDelete={deleteTask}
          onCreateTask={() => setIsCreateModalOpen(true)}
          idPrefix={idPrefix}
        />
      </div>

      {/* Create modal */}
      {isCreateModalOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="新規タスク作成"
          onClick={(e) => { if (e.target === e.currentTarget) setIsCreateModalOpen(false) }}
        >
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">新規タスク作成</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCreateModalOpen(false)}
              >
                閉じる
              </button>
            </div>
            <TaskForm
              onTaskAdd={addTask}
              onSubmitted={() => setIsCreateModalOpen(false)}
              submitLabel="タスクを追加"
              withCard={false}
              idPrefix={idPrefix}
              onIdPrefixChange={setIdPrefix}
              nextId={nextId}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
