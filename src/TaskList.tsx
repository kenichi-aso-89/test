import { type Task, type TaskStatus } from './types'
import { TaskItem } from './TaskItem'
import { Card } from '@/components/ui/card'

interface TaskListProps {
    tasks: Task[]
    onTaskStatusChange: (id: string, status: TaskStatus) => void
    onTaskDelete: (id: string) => void
    onCreateTask: () => void
    idPrefix: string
}

const statusColumns: Array<{ status: TaskStatus; title: string; tone: string }> = [
    { status: '未着手', title: '未対応', tone: 'text-rose-300 bg-rose-500/15 border-rose-500/30' },
    { status: '進行中', title: '処理中', tone: 'text-sky-300 bg-sky-500/15 border-sky-500/30' },
    { status: '完了', title: '処理済み', tone: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' },
]

export function TaskList({
    tasks,
    onTaskStatusChange,
    onTaskDelete,
    onCreateTask,
    idPrefix,
}: TaskListProps) {

    const completedCount = tasks.filter((t) => t.status === '完了').length
    const inProgressCount = tasks.filter((t) => t.status === '進行中').length

    return (
        <div className="space-y-5">
            <Card className="border-slate-700 bg-slate-900/95 p-5 shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-4 text-center sm:w-auto">
                        <div>
                            <div className="text-2xl font-bold text-blue-400">{tasks.length}</div>
                            <div className="text-xs text-slate-400">全タスク</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-amber-400">{inProgressCount}</div>
                            <div className="text-xs text-slate-400">進行中</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
                            <div className="text-xs text-slate-400">完了</div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCreateTask}
                        className="rounded-md bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-emerald-600"
                    >
                        + タスクを追加
                    </button>
                </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
                {statusColumns.map((column) => {
                    const columnTasks = tasks.filter((task) => task.status === column.status)

                    return (
                        <Card key={column.status} className="border-slate-700 bg-slate-900/90 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.06)]">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-200">{column.title}</h3>
                                <span className={`rounded-full border px-2 py-0.5 text-xs ${column.tone}`}>
                                    {columnTasks.length}
                                </span>
                            </div>

                            {columnTasks.length === 0 ? (
                                <div className="rounded-md border border-dashed border-slate-600/70 bg-slate-900/70 p-6 text-center text-sm text-slate-300">
                                    タスクはありません
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {columnTasks.map((task) => (
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
                        </Card>
                    )
                })}
            </div>

            {tasks.length === 0 && (
                <Card className="border-slate-700 bg-slate-900/95 p-8 text-center">
                    <p className="text-slate-400 text-lg">まだタスクがありません。ボタンから新規タスクを追加してください。</p>
                </Card>
            )}
        </div>
    )
}
