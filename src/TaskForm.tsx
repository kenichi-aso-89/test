import { useState } from 'react'
import { type TaskStatus, type WorkType } from './types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TaskFormProps {
    onTaskAdd: (title: string, description: string, status: TaskStatus, workType: WorkType) => void
    onSubmitted?: () => void
    submitLabel?: string
    withCard?: boolean
}

export function TaskForm({
    onTaskAdd,
    onSubmitted,
    submitLabel = 'タスクを追加',
    withCard = true,
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

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                    タスクタイトル <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    placeholder="タスクを入力してください"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">
                    説明 <span className="text-slate-500">(オプション)</span>
                </Label>
                <Input
                    id="description"
                    placeholder="タスクの説明を入力してください"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
            </div>

            {/* Status and WorkType Selects */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Status Select */}
                <div className="space-y-2">
                    <Label htmlFor="status" className="text-slate-300">
                        ステータス
                    </Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="未着手" className="text-white">未着手</SelectItem>
                            <SelectItem value="進行中" className="text-white">進行中</SelectItem>
                            <SelectItem value="完了" className="text-white">完了</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* WorkType Select */}
                <div className="space-y-2">
                    <Label htmlFor="workType" className="text-slate-300">
                        作業内容
                    </Label>
                    <Select value={workType} onValueChange={(value) => setWorkType(value as WorkType)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="検証" className="text-white">検証</SelectItem>
                            <SelectItem value="コード生成" className="text-white">コード生成</SelectItem>
                            <SelectItem value="環境整備" className="text-white">環境整備</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold py-2"
            >
                {submitLabel}
            </Button>
        </form>
    )

    if (!withCard) {
        return formContent
    }

    return (
        <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
                <CardTitle className="text-white">新規タスク作成</CardTitle>
            </CardHeader>
            <CardContent>{formContent}</CardContent>
        </Card>
    )
}
