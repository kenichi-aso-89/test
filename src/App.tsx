import { useState, useMemo } from 'react'
import { type TaskStatus, type TaskTag, type TaskSection, type SidebarView } from './types'
import { Sidebar } from './Sidebar'
import { Toolbar } from './Toolbar'
import { TaskSectionGroup } from './TaskSectionGroup'
import { TaskForm } from './TaskForm'
import { TaskDetailModal } from './TaskDetailModal'
import { useTaskManager } from './useTaskManager'

const sections: TaskSection[] = ['午前', '午後', '終日']

function App() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [activeView, setActiveView] = useState<SidebarView>('today')
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
    const [filterTag, setFilterTag] = useState<TaskTag | 'all'>('all')
    const [collapsedSections, setCollapsedSections] = useState<Set<TaskSection>>(new Set())

    const {
        tasks, idPrefix, setIdPrefix, nextId, isLoading,
        addTask, addTasksBulk, updateTask, updateTaskStatus, toggleStar, addMemo, removeMemo, deleteTask,
    } = useTaskManager()

    const selectedTask = useMemo(
        () => tasks.find((t) => t.id === selectedTaskId) ?? null,
        [tasks, selectedTaskId]
    )

    const filteredTasks = useMemo(() => {
        let result = tasks

        if (activeView === 'starred') {
            result = result.filter((t) => t.starred)
        } else if (activeView === 'incomplete') {
            result = result.filter((t) => t.status !== '完了')
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter((t) =>
                t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q)
            )
        }

        if (filterStatus !== 'all') {
            result = result.filter((t) => t.status === filterStatus)
        }

        if (filterTag !== 'all') {
            result = result.filter((t) => t.tags.includes(filterTag))
        }

        return result
    }, [tasks, activeView, searchQuery, filterStatus, filterTag])

    const toggleSection = (section: TaskSection) => {
        setCollapsedSections((prev) => {
            const next = new Set(prev)
            if (next.has(section)) {
                next.delete(section)
            } else {
                next.add(section)
            }
            return next
        })
    }

    if (isLoading) {
        return (
            <div className="app-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#808890', fontSize: '0.85rem' }}>読み込み中...</p>
            </div>
        )
    }

    return (
        <div className="app-root">
            <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                tasks={tasks}
            />

            <div className="main-area">
                <Toolbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                    filterTag={filterTag}
                    onFilterTagChange={setFilterTag}
                    onCreateTask={() => setIsCreateModalOpen(true)}
                    onImportCsv={addTasksBulk}
                />

                <div className="main-content">
                    {sections.map((section) => {
                        const sectionTasks = filteredTasks.filter((t) => t.section === section)
                        return (
                            <TaskSectionGroup
                                key={section}
                                section={section}
                                tasks={sectionTasks}
                                isCollapsed={collapsedSections.has(section)}
                                onToggleCollapse={() => toggleSection(section)}
                                onTaskStatusChange={updateTaskStatus}
                                onTaskDelete={deleteTask}
                                onToggleStar={toggleStar}
                                onTaskClick={(task) => setSelectedTaskId(task.id)}
                                idPrefix={idPrefix}
                            />
                        )
                    })}

                    {filteredTasks.length === 0 && (
                        <div className="main-empty">
                            タスクはありません
                        </div>
                    )}
                </div>
            </div>

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
                            idPrefix={idPrefix}
                            onIdPrefixChange={setIdPrefix}
                            nextId={nextId}
                        />
                    </div>
                </div>
            )}

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTaskId(null)}
                    onTaskStatusChange={updateTaskStatus}
                    onUpdateTask={updateTask}
                    onAddMemo={addMemo}
                    onRemoveMemo={removeMemo}
                    idPrefix={idPrefix}
                />
            )}
        </div>
    )
}

export default App
