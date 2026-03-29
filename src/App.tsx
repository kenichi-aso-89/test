import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { useTaskManager } from './useTaskManager'
import './App.css'

function App() {
  const { tasks, isLoading, addTask, updateTaskStatus, deleteTask } = useTaskManager()

  if (isLoading) {
    return (
      <div className="app">
        <div className="header">
          <h1>📝 タスク管理</h1>
        </div>
        <div className="loading">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="header">
        <h1>📝 タスク管理</h1>
        <p className="subtitle">毎日のタスクを効率的に管理しましょう</p>
      </div>
      <div className="container">
        <div className="form-section">
          <TaskForm onTaskAdd={addTask} />
        </div>
        <div className="list-section">
          <TaskList
            tasks={tasks}
            onTaskStatusChange={updateTaskStatus}
            onTaskDelete={deleteTask}
          />
        </div>
      </div>
    </div>
  )
}

export default App
