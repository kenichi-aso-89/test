export type TaskStatus = '未着手' | '進行中' | '完了'
export type WorkType = '検証' | 'コード生成' | '環境整備'

export interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    workType: WorkType
    createdAt: string
    completedAt?: string
}
