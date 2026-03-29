import { type Task, type TaskStatus } from './types'
import { TaskItem } from './TaskItem'

interface TaskListProps {
    tasks: Task[]
    onTaskStatusChange: (id: string, status: TaskStatus) => void
    onTaskDelete: (id: string) => void
    onCreateTask: () => void
    idPrefix: string
}

const columns: Array<{
    status: TaskStatus
    title: string
    accent: string
    glow: string
    countBg: string
    countColor: string
}> = [
        {
            status: '未着手',
            title: '未対応',
            accent: 'linear-gradient(90deg, #f59e0b 0%, transparent 75%)',
            glow: 'rgba(245,158,11,0.3)',
            countBg: 'rgba(245,158,11,0.12)',
            countColor: '#f59e0b',
        },
        {
            status: '進行中',
            title: '処理中',
            accent: 'linear-gradient(90deg, #3b82f6 0%, transparent 75%)',
            glow: 'rgba(59,130,246,0.3)',
            countBg: 'rgba(59,130,246,0.12)',
            countColor: '#3b82f6',
        },
        {
            status: '完了',
            title: '処理済み',
            accent: 'linear-gradient(90deg, #10b981 0%, transparent 75%)',
            glow: 'rgba(16,185,129,0.3)',
            countBg: 'rgba(16,185,129,0.12)',
            countColor: '#10b981',
        },
    ]

export function TaskList({ tasks, onTaskStatusChange, onTaskDelete, onCreateTask, idPrefix }: TaskListProps) {
    const completedCount = tasks.filter(t => t.status === '完了').length
    const inProgressCount = tasks.filter(t => t.status === '進行中').length

    return (
        <div>
            {/* Stats + add button */}
            <div className="stats-panel">
                <div className="stats-group">
                    {[
                        { value: tasks.length, label: '全タスク', color: '#c8d8f8' },
                        { value: inProgressCount, label: '進行中', color: '#f59e0b' },
                        { value: completedCount, label: '完了', color: '#10b981' },
                    ].map(({ value, label, color }) => (
                        <div key={label} className="stat-item">
                            <div className="stat-value" style={{ color }}>{value}</div>
                            <div className="stat-label">{label}</div>
                        </div>
                    ))}
                </div>

                <button className="add-task-btn" onClick={onCreateTask}>
                    + タスクを追加
                </button>
            </div>

            {/* Board */}
            <div className="board-grid">
                {columns.map(col => {
                    const colTasks = tasks.filter(t => t.status === col.status)
                    return (
                        <div key={col.status} className="column-panel">
                            {/* Accent line */}
                            <div className="column-accent" style={{ background: col.accent }} />

                            {/* Column header */}
                            <div className="column-header">
                                <span className="column-title">{col.title}</span>
                                <span
                                    className="column-count"
                                    style={{ background: col.countBg, color: col.countColor }}
                                >
                                    {colTasks.length}
                                </span>
                            </div>

                            {/* Tasks or empty */}
                            {colTasks.length === 0 ? (
                                <div className="column-empty">タスクはありません</div>
                            ) : (
                                <div className="column-tasks">
                                    {colTasks.map(task => (
                                        <TaskItem
                                            key={task.id}
                                            task={task}
                                            onTaskStatusChange={onTaskStatusChange}
                                            onTaskDelete={onTaskDelete}
                                            idPrefix={idPrefix}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Global empty state */}
            {tasks.length === 0 && (
                <div className="board-empty">
                    まだタスクがありません。ボタンから新規タスクを追加してください。
                </div>
            )}
        </div>
    )
}
