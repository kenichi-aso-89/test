import { useState } from 'react'
import { type TaskStatus, type WorkType } from './types'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface TaskFormProps {
    onTaskAdd: (title: string, description: string, status: TaskStatus, workType: WorkType) => void
    onSubmitted?: () => void
    submitLabel?: string
    withCard?: boolean
    idPrefix?: string
    onIdPrefixChange?: (value: string) => void
    nextId?: number
}

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onTaskAdd(title, description, status, workType)
            setTitle('')
            setDescription('')
            setStatus('未着手')
            setWorkType('コード生成')
            onSubmitted?.()
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ID section */}
            {typeof idPrefix === 'string' && onIdPrefixChange && typeof nextId === 'number' && (
                <div className="form-section">
                    <div style={{ fontSize: '0.58rem', color: '#5a6570', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        次のID
                    </div>
                    <div className="form-id-preview">{`${idPrefix}${nextId}`}</div>
                    <label className="form-label" htmlFor="idPrefix">プレフィックス</label>
                    <Input
                        id="idPrefix"
                        value={idPrefix}
                        onChange={(e) => onIdPrefixChange(e.target.value)}
                        placeholder="例: MARKETINGJP-"
                        className="form-input"
                    />
                </div>
            )}

            {/* Title */}
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

            {/* Description */}
            <div>
                <label className="form-label" htmlFor="description">
                    説明 <span style={{ color: '#5a6570' }}>(オプション)</span>
                </label>
                <Input
                    id="description"
                    placeholder="タスクの説明を入力してください"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-input"
                />
            </div>

            {/* Status + WorkType */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label className="form-label">ステータス</label>
                    <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                        <SelectTrigger className="form-select-trigger">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ background: '#161819', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px' }}>
                            <SelectItem value="未着手" style={{ color: '#c0c8d0', fontSize: '0.85rem' }}>未着手</SelectItem>
                            <SelectItem value="進行中" style={{ color: '#c0c8d0', fontSize: '0.85rem' }}>進行中</SelectItem>
                            <SelectItem value="完了" style={{ color: '#c0c8d0', fontSize: '0.85rem' }}>完了</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="form-label">作業内容</label>
                    <Select value={workType} onValueChange={(v) => setWorkType(v as WorkType)}>
                        <SelectTrigger className="form-select-trigger">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ background: '#161819', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px' }}>
                            <SelectItem value="検証" style={{ color: '#c0c8d0', fontSize: '0.85rem' }}>検証</SelectItem>
                            <SelectItem value="コード生成" style={{ color: '#c0c8d0', fontSize: '0.85rem' }}>コード生成</SelectItem>
                            <SelectItem value="環境整備" style={{ color: '#c0c8d0', fontSize: '0.85rem' }}>環境整備</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Submit */}
            <button type="submit" className="form-submit-btn">
                {submitLabel}
            </button>
        </form>
    )
}
