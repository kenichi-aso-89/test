import { type Task, type TaskStatus } from './types'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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

export function TaskItem({ task, onTaskStatusChange, onTaskDelete, idPrefix = '' }: TaskItemProps) {
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
                return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            case '進行中':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            case '完了':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            default:
                return ''
        }
    }

    const displayId = /^\d+$/.test(task.id) ? `${idPrefix}${task.id}` : task.id

    return (
        <Card className="border-slate-600 bg-slate-800/95 p-6 shadow-[0_4px_16px_rgba(2,6,23,0.25)] hover:border-slate-500 transition-colors">
            {/* ID */}
            <div className="mb-4 flex items-start justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    ID: {displayId}
                </span>
                <div className="flex gap-2">
                    <Badge variant="outline" className={`${getStatusColor(task.status)}`}>
                        {task.status}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {task.workType}
                    </Badge>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>

            {/* Description */}
            {task.description && (
                <p className="text-slate-200 text-sm mb-4">{task.description}</p>
            )}

            {/* Dates */}
            <div className="text-xs text-slate-300 space-y-1 mb-6">
                <div>作成: {formatDate(task.createdAt)}</div>
                {task.completedAt && (
                    <div>完了: {formatDate(task.completedAt)}</div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 items-center">
                <div className="flex-1">
                    <Select
                        value={task.status}
                        onValueChange={(value) => onTaskStatusChange(task.id, value as TaskStatus)}
                    >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                            {statusOptions.map((status) => (
                                <SelectItem key={status} value={status} className="text-white">
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onTaskDelete(task.id)}
                    className="bg-transparent text-white border border-white/40 hover:bg-white/10 hover:text-white"
                    aria-label="タスクを削除"
                >
                    <Trash2 className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </div>
        </Card>
    )
}
