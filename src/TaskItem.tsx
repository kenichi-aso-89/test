import { type Task, type TaskStatus } from './types'
import './TaskItem.css'

interface TaskItemProps {
    task: Task
    onTaskStatusChange: (id: string, status: TaskStatus) => void
    onTaskDelete: (id: string) => void
}

const statusOptions: TaskStatus[] = ['未着手', '進行中', '完了']

export function TaskItem({ task, onTaskStatusChange, onTaskDelete }: TaskItemProps) {
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case '未着手':
                return 'status-pending'
            case '進行中':
                return 'status-inprogress'
            case '完了':
                return 'status-completed'
            default:
                return ''
        }
    }

    return (
        <div className="task-item">
            <div className="task-id">ID: {task.id}</div>
            <div className="task-content">
                <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div className="task-metadata">
                        <span className={`status-badge ${getStatusColor(task.status)}`}>
                            {task.status}
                        </span>
                        <span className="work-type-badge">{task.workType}</span>
                    </div>
                </div>
                {task.description && <p className="task-description">{task.description}</p>}
                <div className="task-dates">
                    <small>作成: {formatDate(task.createdAt)}</small>
                    {task.completedAt && (
                        <small>完了: {formatDate(task.completedAt)}</small>
                    )}
                </div>
            </div>
            <div className="task-actions">
                <select
                    value={task.status}
                    onChange={(e) => onTaskStatusChange(task.id, e.target.value as TaskStatus)}
                    className="status-select"
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <button
                    className="btn-delete"
                    onClick={() => onTaskDelete(task.id)}
                    title="削除"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}
