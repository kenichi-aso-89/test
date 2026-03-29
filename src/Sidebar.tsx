import { type Task, type SidebarView } from './types'
import { Calendar, Star, AlertCircle } from 'lucide-react'

interface SidebarProps {
    activeView: SidebarView
    onViewChange: (view: SidebarView) => void
    tasks: Task[]
}

const views: Array<{
    id: SidebarView
    label: string
    icon: typeof Calendar
    countFn: (tasks: Task[]) => number
}> = [
    {
        id: 'today',
        label: '今日',
        icon: Calendar,
        countFn: (tasks) => tasks.filter((t) => t.status !== '完了').length,
    },
    {
        id: 'starred',
        label: 'スター',
        icon: Star,
        countFn: (tasks) => tasks.filter((t) => t.starred).length,
    },
    {
        id: 'incomplete',
        label: '未完了',
        icon: AlertCircle,
        countFn: (tasks) => tasks.filter((t) => t.status !== '完了').length,
    },
]

export function Sidebar({ activeView, onViewChange, tasks }: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">Task Board</div>

            <div className="sidebar-section">
                <div className="sidebar-section-label">タスク</div>
                {views.map((view) => {
                    const count = view.countFn(tasks)
                    const Icon = view.icon
                    return (
                        <button
                            key={view.id}
                            className={`sidebar-item ${activeView === view.id ? 'active' : ''}`}
                            onClick={() => onViewChange(view.id)}
                        >
                            <Icon size={14} />
                            <span className="sidebar-item-label">{view.label}</span>
                            {count > 0 && (
                                <span className="sidebar-count">{count}</span>
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-label">概要</div>
                <div className="sidebar-stats">
                    <div className="sidebar-stat">
                        <span className="sidebar-stat-value">
                            {tasks.filter((t) => t.status === '完了').length}
                        </span>
                        <span className="sidebar-stat-label">完了</span>
                    </div>
                    <div className="sidebar-stat">
                        <span className="sidebar-stat-value">
                            {tasks.filter((t) => t.status === '進行中').length}
                        </span>
                        <span className="sidebar-stat-label">進行中</span>
                    </div>
                    <div className="sidebar-stat">
                        <span className="sidebar-stat-value">{tasks.length}</span>
                        <span className="sidebar-stat-label">全体</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
