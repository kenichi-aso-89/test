import { Search, Plus } from 'lucide-react'
import { type TaskTag, type TaskStatus } from './types'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface ToolbarProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    filterStatus: TaskStatus | 'all'
    onFilterStatusChange: (status: TaskStatus | 'all') => void
    filterTag: TaskTag | 'all'
    onFilterTagChange: (tag: TaskTag | 'all') => void
    onCreateTask: () => void
}

const allTags: TaskTag[] = ['Mail', 'Office', 'Meeting', 'PC', 'Home']

export function Toolbar({
    searchQuery,
    onSearchChange,
    filterStatus,
    onFilterStatusChange,
    filterTag,
    onFilterTagChange,
    onCreateTask,
}: ToolbarProps) {
    const today = new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })

    return (
        <div className="toolbar">
            <div className="toolbar-left">
                <div className="toolbar-search">
                    <Search size={14} className="toolbar-search-icon" />
                    <Input
                        placeholder="タスクを検索..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="toolbar-search-input"
                    />
                </div>

                <Select
                    value={filterStatus}
                    onValueChange={(v) => onFilterStatusChange(v as TaskStatus | 'all')}
                >
                    <SelectTrigger className="toolbar-filter-trigger">
                        <SelectValue placeholder="ステータス" />
                    </SelectTrigger>
                    <SelectContent className="toolbar-dropdown">
                        <SelectItem value="all">ステータス: 全て</SelectItem>
                        <SelectItem value="未着手">未着手</SelectItem>
                        <SelectItem value="進行中">進行中</SelectItem>
                        <SelectItem value="完了">完了</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filterTag}
                    onValueChange={(v) => onFilterTagChange(v as TaskTag | 'all')}
                >
                    <SelectTrigger className="toolbar-filter-trigger">
                        <SelectValue placeholder="タグ" />
                    </SelectTrigger>
                    <SelectContent className="toolbar-dropdown">
                        <SelectItem value="all">タグ: 全て</SelectItem>
                        {allTags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                                {tag}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="toolbar-right">
                <span className="toolbar-date">{today}</span>
                <button className="toolbar-add-btn" onClick={onCreateTask}>
                    <Plus size={15} />
                    <span>追加</span>
                </button>
            </div>
        </div>
    )
}
