import { type Task, type TaskStatus } from './types'
import { TaskItem } from './TaskItem'
import './TaskList.css'

interface TaskListProps {
    tasks: Task[]
    onTaskStatusChange: (id: string, status: TaskStatus) => void
    onTaskDelete: (id: string) => void
}

export function TaskList({ tasks, onTaskStatusChange, onTaskDelete }: TaskListProps) {
    if (tasks.length === 0) {
        return <div className="empty-state">タスクはありません</div>
    }

    const completedCount = tasks.filter((t) => t.status === '完了').length

    return (
        <div className="task-list-container">
            <div className="task-stats">
                <p>
                    完了: <strong>{completedCount}</strong> / <strong>{tasks.length}</strong>
                </p>
            </div>
            <div className="task-list">
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onTaskStatusChange={onTaskStatusChange}
                        onTaskDelete={onTaskDelete}
                    />
                ))}
            </div>
        </div>
    )
}
