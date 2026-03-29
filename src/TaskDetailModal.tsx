import { useState } from 'react'
import { type Task, type TaskStatus, type WorkType, type TaskSection, type TaskTag } from './types'
import { X, Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface TaskDetailModalProps {
    task: Task
    onClose: () => void
    onTaskStatusChange: (id: string, status: TaskStatus) => void
    onUpdateTask: (id: string, updates: Partial<Task>) => void
    onAddMemo: (taskId: string, text: string) => void
    onRemoveMemo: (taskId: string, memoId: string) => void
    idPrefix: string
}

export function TaskDetailModal({
    task,
    onClose,
    onTaskStatusChange,
    onUpdateTask,
    onAddMemo,
    onRemoveMemo,
    idPrefix,
}: TaskDetailModalProps) {
    const [memoInput, setMemoInput] = useState('')
    const displayId = /^\d+$/.test(task.id) ? `${idPrefix}${task.id}` : task.id

    // タグを表示用の文字列に変換（セミコロン区切り）
    const tagsString = task.tags.join('; ')

    const handleUpdateField = <K extends keyof Task>(field: K, value: Task[K]) => {
        onUpdateTask(task.id, { [field]: value })
    }

    const handleTagsChange = (input: string) => {
        const newTags = input
            .split(/[;,/]/)
            .map((t) => t.trim())
            .filter((t): t is TaskTag => {
                const validTags: TaskTag[] = ['Mail', 'Office', 'Meeting', 'PC', 'Home']
                return validTags.includes(t as TaskTag)
            })
        handleUpdateField('tags', newTags)
    }

    const handleAddMemo = () => {
        if (memoInput.trim()) {
            onAddMemo(task.id, memoInput)
            setMemoInput('')
        }
    }

    const handleRemoveMemo = (memoId: string) => {
        if (confirm('このメモを削除してもよろしいですか？')) {
            onRemoveMemo(task.id, memoId)
        }
    }

    const createdDate = new Date(task.createdAt).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
    const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }) : null

    return (
        <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-detail-title"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="modal-panel modal-panel-detail">
                <div className="modal-header">
                    <div className="modal-header-title">
                        <Input
                            value={task.title}
                            onChange={(e) => handleUpdateField('title', e.target.value)}
                            className="modal-title-input"
                            placeholder="タスク名"
                        />
                        <span className="modal-subtitle">{displayId}</span>
                    </div>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="task-detail-content">
                    {/* 基本情報 */}
                    <section className="detail-section">
                        <h3 className="detail-section-title">基本情報</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label className="detail-label">ステータス</label>
                                <Select
                                    value={task.status}
                                    onValueChange={(v) => onTaskStatusChange(task.id, v as TaskStatus)}
                                >
                                    <SelectTrigger className="detail-select-trigger">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="toolbar-dropdown">
                                        <SelectItem value="未着手">未着手</SelectItem>
                                        <SelectItem value="進行中">進行中</SelectItem>
                                        <SelectItem value="完了">完了</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="detail-item">
                                <label className="detail-label">作業内容</label>
                                <Select
                                    value={task.workType}
                                    onValueChange={(v) => handleUpdateField('workType', v as WorkType)}
                                >
                                    <SelectTrigger className="detail-select-trigger">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="toolbar-dropdown">
                                        <SelectItem value="検証">検証</SelectItem>
                                        <SelectItem value="コード生成">コード生成</SelectItem>
                                        <SelectItem value="環境整備">環境整備</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="detail-item">
                                <label className="detail-label">セクション</label>
                                <Select
                                    value={task.section}
                                    onValueChange={(v) => handleUpdateField('section', v as TaskSection)}
                                >
                                    <SelectTrigger className="detail-select-trigger">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="toolbar-dropdown">
                                        <SelectItem value="午前">午前</SelectItem>
                                        <SelectItem value="午後">午後</SelectItem>
                                        <SelectItem value="終日">終日</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </section>

                    {/* 説明 */}
                    <section className="detail-section">
                        <h3 className="detail-section-title">説明</h3>
                        <textarea
                            value={task.description}
                            onChange={(e) => handleUpdateField('description', e.target.value)}
                            className="detail-textarea"
                            placeholder="タスクの説明を入力"
                            rows={3}
                        />
                    </section>

                    {/* スケジュール */}
                    <section className="detail-section">
                        <h3 className="detail-section-title">スケジュール</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label className="detail-label">見積時間（分）</label>
                                <Input
                                    type="number"
                                    value={task.estimatedMinutes ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value ? parseInt(e.target.value, 10) : null
                                        handleUpdateField('estimatedMinutes', val)
                                    }}
                                    placeholder="分数"
                                    className="detail-input"
                                />
                            </div>
                            <div className="detail-item">
                                <label className="detail-label">開始時刻</label>
                                <Input
                                    type="text"
                                    value={task.scheduledStart ?? ''}
                                    onChange={(e) => handleUpdateField('scheduledStart', e.target.value || null)}
                                    placeholder="HH:MM"
                                    className="detail-input"
                                />
                            </div>
                            <div className="detail-item">
                                <label className="detail-label">終了時刻</label>
                                <Input
                                    type="text"
                                    value={task.scheduledEnd ?? ''}
                                    onChange={(e) => handleUpdateField('scheduledEnd', e.target.value || null)}
                                    placeholder="HH:MM"
                                    className="detail-input"
                                />
                            </div>
                        </div>
                    </section>

                    {/* タグ */}
                    <section className="detail-section">
                        <h3 className="detail-section-title">タグ</h3>
                        <div className="detail-tags-input-wrapper">
                            <Input
                                value={tagsString}
                                onChange={(e) => handleTagsChange(e.target.value)}
                                placeholder="タグをセミコロン区切りで入力（Mail, Office, Meeting, PC, Home）"
                                className="detail-input"
                            />
                            {task.tags.length > 0 && (
                                <div className="detail-tags">
                                    {task.tags.map((tag) => (
                                        <span key={tag} className="detail-tag">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 日時情報 */}
                    <section className="detail-section">
                        <h3 className="detail-section-title">日時情報</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label className="detail-label">作成日</label>
                                <div className="detail-value">{createdDate}</div>
                            </div>
                            {completedDate && (
                                <div className="detail-item">
                                    <label className="detail-label">完了日</label>
                                    <div className="detail-value">{completedDate}</div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* メモ */}
                    <section className="detail-section">
                        <h3 className="detail-section-title">メモ</h3>
                        <div className="detail-memo-input">
                            <Input
                                placeholder="メモを追加..."
                                value={memoInput}
                                onChange={(e) => setMemoInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddMemo()
                                    }
                                }}
                                className="detail-input"
                            />
                            <button
                                className="detail-add-memo-btn"
                                onClick={handleAddMemo}
                                disabled={!memoInput.trim()}
                                type="button"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        {task.memos.length > 0 ? (
                            <div className="detail-memos-list">
                                {task.memos.map((memo) => {
                                    const memoDate = new Date(memo.createdAt)
                                    const memoTime = memoDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
                                    const dateStr = memoDate.toLocaleDateString('ja-JP')
                                    return (
                                        <div key={memo.id} className="detail-memo-item">
                                            <div className="detail-memo-header">
                                                <span className="detail-memo-time">{dateStr} {memoTime}</span>
                                                <button
                                                    className="detail-memo-delete"
                                                    onClick={() => handleRemoveMemo(memo.id)}
                                                    type="button"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <div className="detail-memo-text">{memo.text}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="detail-memos-empty">メモはまだ追加されていません</div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}
