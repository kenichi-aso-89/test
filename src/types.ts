export type TaskStatus = '未着手' | '進行中' | '完了'
export type WorkType = '検証' | 'コード生成' | '環境整備'
export type TaskTag = 'Mail' | 'Office' | 'Meeting' | 'PC' | 'Home'
export type TaskSection = '午前' | '午後' | '終日'
export type SidebarView = 'today' | 'starred' | 'incomplete'

export interface TaskMemo {
    id: string
    text: string
    createdAt: string
}

export interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    workType: WorkType
    createdAt: string
    completedAt?: string
    tags: TaskTag[]
    starred: boolean
    estimatedMinutes: number | null
    scheduledStart: string | null
    scheduledEnd: string | null
    section: TaskSection
    memos: TaskMemo[]
}
