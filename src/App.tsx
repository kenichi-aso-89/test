import { useState } from 'react'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { useTaskManager } from './useTaskManager'

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { tasks, idPrefix, setIdPrefix, nextId, isLoading, addTask, updateTaskStatus, deleteTask } = useTaskManager()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">📝 タスク管理</h1>
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-3">
            📝 タスク管理
          </h1>
          <p className="text-slate-400 text-lg">毎日のタスクを効率的に管理しましょう</p>
        </div>

        <div className="grid gap-8">
          <div>
            <TaskList
              tasks={tasks}
              onTaskStatusChange={updateTaskStatus}
              onTaskDelete={deleteTask}
              onCreateTask={() => setIsCreateModalOpen(true)}
              idPrefix={idPrefix}
            />
          </div>
        </div>

        {isCreateModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="新規タスク作成"
          >
            <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">新規タスク作成</h2>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-md px-2 py-1 text-slate-300 transition hover:bg-slate-700 hover:text-white"
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
    </div>
  )
}

export default App
