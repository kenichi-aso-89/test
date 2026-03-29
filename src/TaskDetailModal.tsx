import { useState } from 'react'
import { type Task, type TaskStatus } from './types'
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
    onAddMemo: (taskId: string, text: string) => void
    onRemoveMemo: (taskId: string, memoId: string) => void
    idPrefix: string
}

export function TaskDetailModal({
    task,
    onClose,
    onTaskStatusChange,
    onAddMemo,
    onRemoveMemo,
    idPrefix,
}: TaskDetailModalProps) {
    const [memoInput, setMemoInput] = useState('')
    const displayId = /^\d+$/.test(task.id) ? `${idPrefix}${task.id}` : task.id

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
            aria-label="タスク詳細"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="modal-panel modal-panel-detail">
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{task.title}</h2>
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
                                <div className="detail-value">{task.workType}</div>
                            </div>
                            <div className="detail-item">
                                <label className="detail-label">セクション</label>
                                <div className="detail-value">{task.section}</div>
                            </div>
                        </div>
                    </section>

                    {/* 説明 */}
                    <section className="detail-section">
                        <h3 className="detail-section-title">説明</h3>
                        <div className="detail-value-text">
                            {task.description || '（説明なし）'}
                        </div>
                    </section>

                    {/* スケジュール */}
                    <section className="detail-section">
                        <h3 className="detail-section-title">スケジュール</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label className="detail-label">見積時間</label>
                                <div className="detail-value">
                                    {task.estimatedMinutes ? `${task.estimatedMinutes}分` : '未設定'}
                                </div>
                            </div>
                            <div className="detail-item">
                                <label className="detail-label">開始時刻</label>
                                <div className="detail-value">
                                    {task.scheduledStart || '未設定'}
                                </div>
                            </div>
                            <div className="detail-item">
                                <label className="detail-label">終了時刻</label>
                                <div className="detail-value">
                                    {task.scheduledEnd || '未設定'}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* タグ */}
                    {task.tags.length > 0 && (
                        <section className="detail-section">
                            <h3 className="detail-section-title">タグ</h3>
                            <div className="detail-tags">
                                {task.tags.map((tag) => (
                                    <span key={tag} className="detail-tag">{tag}</span>
                                ))}
                            </div>
                        </section>
                    )}

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
