import { type Task, type TaskStatus } from './types'
import { Star, Trash2 } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface TaskRowProps {
    task: Task
    onTaskStatusChange: (id: string, status: TaskStatus) => void
    onTaskDelete: (id: string) => void
    onToggleStar: (id: string) => void
    idPrefix: string
}

const statusDot: Record<TaskStatus, string> = {
    '未着手': '#f59e0b',
    '進行中': '#3b82f6',
    '完了': '#10b981',
}

export function TaskRow({ task, onTaskStatusChange, onTaskDelete, onToggleStar, idPrefix }: TaskRowProps) {
    const displayId = /^\d+$/.test(task.id) ? `${idPrefix}${task.id}` : task.id
    const dotColor = statusDot[task.status]

    return (
        <div className={`task-row ${task.status === '完了' ? 'task-row-done' : ''}`}>
            <span
                className="task-row-dot"
                style={{ background: dotColor }}
            />

            <span className="task-row-title">{task.title}</span>

            {task.tags.length > 0 && (
                <span className="task-row-tags">
                    {task.tags.map((tag) => (
                        <span key={tag} className="task-row-tag">{tag}</span>
                    ))}
                </span>
            )}

            <span className="task-row-worktype">{task.workType}</span>

            {task.estimatedMinutes != null && (
                <span className="task-row-duration">
                    {task.estimatedMinutes}min.
                </span>
            )}

            {task.scheduledStart && (
                <span className="task-row-time">
                    {task.scheduledStart}{task.scheduledEnd ? `-${task.scheduledEnd}` : ''}
                </span>
            )}

            <span className="task-row-spacer" />

            <Select
                value={task.status}
                onValueChange={(v) => onTaskStatusChange(task.id, v as TaskStatus)}
            >
                <SelectTrigger className="task-row-select">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="toolbar-dropdown">
                    <SelectItem value="未着手">未着手</SelectItem>
                    <SelectItem value="進行中">進行中</SelectItem>
                    <SelectItem value="完了">完了</SelectItem>
                </SelectContent>
            </Select>

            <button
                className={`task-row-star ${task.starred ? 'starred' : ''}`}
                onClick={() => onToggleStar(task.id)}
                aria-label="スター"
            >
                <Star size={14} fill={task.starred ? '#f59e0b' : 'none'} />
            </button>

            <button
                className="task-row-delete"
                onClick={() => onTaskDelete(task.id)}
                aria-label="削除"
            >
                <Trash2 size={13} />
            </button>

            <span className="task-row-id">{displayId}</span>
        </div>
    )
}
