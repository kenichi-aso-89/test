import { useState } from 'react'
import { type TaskStatus, type WorkType, type TaskTag, type TaskSection } from './types'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface TaskFormProps {
    onTaskAdd: (
        title: string,
        description: string,
        status: TaskStatus,
        workType: WorkType,
        tags?: TaskTag[],
        estimatedMinutes?: number | null,
        scheduledStart?: string | null,
        scheduledEnd?: string | null,
        section?: TaskSection,
    ) => void
    onSubmitted?: () => void
    submitLabel?: string
    idPrefix?: string
    onIdPrefixChange?: (value: string) => void
    nextId?: number
}

const allTags: TaskTag[] = ['Mail', 'Office', 'Meeting', 'PC', 'Home']
const allSections: TaskSection[] = ['午前', '午後', '終日']

export function TaskForm({
    onTaskAdd,
    onSubmitted,
    submitLabel = 'タスクを追加',
    idPrefix,
    onIdPrefixChange,
    nextId,
}: TaskFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState<TaskStatus>('未着手')
    const [workType, setWorkType] = useState<WorkType>('コード生成')
    const [selectedTags, setSelectedTags] = useState<TaskTag[]>([])
    const [estimatedMinutes, setEstimatedMinutes] = useState('')
    const [scheduledStart, setScheduledStart] = useState('')
    const [scheduledEnd, setScheduledEnd] = useState('')
    const [section, setSection] = useState<TaskSection>('終日')

    const toggleTag = (tag: TaskTag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onTaskAdd(
                title,
                description,
                status,
                workType,
                selectedTags,
                estimatedMinutes ? parseInt(estimatedMinutes, 10) : null,
                scheduledStart || null,
                scheduledEnd || null,
                section,
            )
            setTitle('')
            setDescription('')
            setStatus('未着手')
            setWorkType('コード生成')
            setSelectedTags([])
            setEstimatedMinutes('')
            setScheduledStart('')
            setScheduledEnd('')
            setSection('終日')
            onSubmitted?.()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="task-form">
            {typeof idPrefix === 'string' && onIdPrefixChange && typeof nextId === 'number' && (
                <div className="form-section">
                    <div className="form-section-hint">次のID</div>
                    <div className="form-id-preview">{`${idPrefix}${nextId}`}</div>
                    <label className="form-label" htmlFor="idPrefix">プレフィックス</label>
                    <Input
                        id="idPrefix"
                        value={idPrefix}
                        onChange={(e) => onIdPrefixChange(e.target.value)}
                        placeholder="例: TASK-"
                        className="form-input"
                    />
                </div>
            )}

            <div>
                <label className="form-label" htmlFor="title">
                    タスクタイトル <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <Input
                    id="title"
                    placeholder="タスクを入力してください"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                />
            </div>

            <div>
                <label className="form-label" htmlFor="description">
                    説明 <span className="form-optional">(オプション)</span>
                </label>
                <Input
                    id="description"
                    placeholder="タスクの説明を入力してください"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="form-grid-2">
                <div>
                    <label className="form-label">ステータス</label>
                    <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                        <SelectTrigger className="form-select-trigger">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="toolbar-dropdown">
                            <SelectItem value="未着手">未着手</SelectItem>
                            <SelectItem value="進行中">進行中</SelectItem>
                            <SelectItem value="完了">完了</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="form-label">作業内容</label>
                    <Select value={workType} onValueChange={(v) => setWorkType(v as WorkType)}>
                        <SelectTrigger className="form-select-trigger">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="toolbar-dropdown">
                            <SelectItem value="検証">検証</SelectItem>
                            <SelectItem value="コード生成">コード生成</SelectItem>
                            <SelectItem value="環境整備">環境整備</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <label className="form-label">セクション</label>
                <div className="form-section-btns">
                    {allSections.map((s) => (
                        <button
                            key={s}
                            type="button"
                            className={`form-section-btn ${section === s ? 'active' : ''}`}
                            onClick={() => setSection(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="form-label">タグ</label>
                <div className="form-tag-btns">
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            className={`form-tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-grid-3">
                <div>
                    <label className="form-label" htmlFor="estimatedMinutes">見積時間 (分)</label>
                    <Input
                        id="estimatedMinutes"
                        type="number"
                        placeholder="60"
                        value={estimatedMinutes}
                        onChange={(e) => setEstimatedMinutes(e.target.value)}
                        className="form-input"
                        min="0"
                    />
                </div>
                <div>
                    <label className="form-label" htmlFor="scheduledStart">開始</label>
                    <Input
                        id="scheduledStart"
                        type="time"
                        value={scheduledStart}
                        onChange={(e) => setScheduledStart(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div>
                    <label className="form-label" htmlFor="scheduledEnd">終了</label>
                    <Input
                        id="scheduledEnd"
                        type="time"
                        value={scheduledEnd}
                        onChange={(e) => setScheduledEnd(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <button type="submit" className="form-submit-btn">
                {submitLabel}
            </button>
        </form>
    )
}
