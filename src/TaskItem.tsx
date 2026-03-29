import { type Task, type TaskStatus } from './types'
import { Trash2 } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface TaskItemProps {
    task: Task
    onTaskStatusChange: (id: string, status: TaskStatus) => void
    onTaskDelete: (id: string) => void
    idPrefix?: string
}

const statusOptions: TaskStatus[] = ['未着手', '進行中', '完了']

const statusDot: Record<TaskStatus, { color: string; glow: string }> = {
    '未着手': { color: '#f59e0b', glow: 'rgba(245,158,11,0.55)' },
    '進行中': { color: '#3b82f6', glow: 'rgba(59,130,246,0.55)' },
    '完了': { color: '#10b981', glow: 'rgba(16,185,129,0.55)' },
}

export function TaskItem({ task, onTaskStatusChange, onTaskDelete, idPrefix = '' }: TaskItemProps) {
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleString('ja-JP', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
        })
    }

    const displayId = /^\d+$/.test(task.id) ? `${idPrefix}${task.id}` : task.id
    const dot = statusDot[task.status]

    return (
        <div className="task-card">
            {/* Top row: ID + WorkType */}
            <div className="task-card-top">
                <span className="task-id">{displayId}</span>
                <span className="task-worktype">{task.workType}</span>
            </div>

            {/* Status row */}
            <div className="task-status-row">
                <span
                    className="task-status-dot"
                    style={{
                        background: dot.color,
                        boxShadow: `0 0 6px ${dot.glow}`,
                    }}
                />
                <span className="task-status-text">{task.status}</span>
            </div>

            {/* Title */}
            <h3 className="task-title">{task.title}</h3>

            {/* Description */}
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            {/* Dates */}
            <div className="task-date">
                {formatDate(task.createdAt)}
                {task.completedAt && (
                    <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                        · 完了: {formatDate(task.completedAt)}
                    </span>
                )}
            </div>

            <div className="task-divider" />

            {/* Actions */}
            <div className="task-actions">
                <div style={{ flex: 1 }}>
                    <Select
                        value={task.status}
                        onValueChange={(value) => onTaskStatusChange(task.id, value as TaskStatus)}
                    >
                        <SelectTrigger className="task-select-trigger">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{
                            background: '#161819',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '8px',
                        }}>
                            {statusOptions.map(s => (
                                <SelectItem key={s} value={s} style={{ color: '#c0c8d0', fontSize: '0.8rem' }}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <button
                    className="delete-btn"
                    onClick={() => onTaskDelete(task.id)}
                    aria-label="タスクを削除"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    )
}
