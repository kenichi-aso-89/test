import { type Task, type TaskStatus, type TaskSection } from './types'
import { TaskRow } from './TaskRow'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface TaskSectionGroupProps {
    section: TaskSection
    tasks: Task[]
    isCollapsed: boolean
    onToggleCollapse: () => void
    onTaskStatusChange: (id: string, status: TaskStatus) => void
    onTaskDelete: (id: string) => void
    onToggleStar: (id: string) => void
    idPrefix: string
}

export function TaskSectionGroup({
    section,
    tasks,
    isCollapsed,
    onToggleCollapse,
    onTaskStatusChange,
    onTaskDelete,
    onToggleStar,
    idPrefix,
}: TaskSectionGroupProps) {
    const totalMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0)
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    const timeDisplay = totalMinutes > 0
        ? hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`
        : ''

    return (
        <div className="section-group">
            <button className="section-header" onClick={onToggleCollapse}>
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                <span className="section-header-title">{section}</span>
                <span className="section-header-count">{tasks.length}</span>
                {timeDisplay && (
                    <span className="section-header-time">所要時間 {timeDisplay}</span>
                )}
            </button>

            {!isCollapsed && (
                <div className="section-tasks">
                    {tasks.length === 0 ? (
                        <div className="section-empty">タスクはありません</div>
                    ) : (
                        tasks.map((task) => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                onTaskStatusChange={onTaskStatusChange}
                                onTaskDelete={onTaskDelete}
                                onToggleStar={onToggleStar}
                                idPrefix={idPrefix}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
