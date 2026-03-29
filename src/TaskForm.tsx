import { useState } from 'react'
import { type TaskStatus, type WorkType } from './types'
import './TaskForm.css'

interface TaskFormProps {
    onTaskAdd: (title: string, description: string, status: TaskStatus, workType: WorkType) => void
}

export function TaskForm({ onTaskAdd }: TaskFormProps) {
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
        }
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="タスクを入力"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="task-input"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="説明（オプション）"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="task-input"
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>ステータス</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        className="task-select"
                    >
                        <option value="未着手">未着手</option>
                        <option value="進行中">進行中</option>
                        <option value="完了">完了</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>作業内容</label>
                    <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value as WorkType)}
                        className="task-select"
                    >
                        <option value="検証">検証</option>
                        <option value="コード生成">コード生成</option>
                        <option value="環境整備">環境整備</option>
                    </select>
                </div>
            </div>
            <button type="submit" className="btn-add">
                タスクを追加
            </button>
        </form>
    )
}
