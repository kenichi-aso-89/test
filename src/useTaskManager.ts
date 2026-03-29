import { useState, useEffect } from 'react'
import { type Task, type TaskStatus, type WorkType, type TaskTag, type TaskSection } from './types'

const STORAGE_KEY = 'tasks'
const ID_PREFIX_STORAGE_KEY = 'task_id_prefix'
const DEFAULT_ID_PREFIX = 'TASK-'

const extractNumericId = (id: string): number => {
    const matched = id.match(/(\d+)$/)
    return matched ? parseInt(matched[1], 10) : 0
}

const normalizeTaskIds = (loadedTasks: Task[]): Task[] => {
    return loadedTasks
}

const getNextUniqueId = (start: number, tasks: Task[]): number => {
    const used = new Set(tasks.map((task) => extractNumericId(task.id)).filter((num) => num > 0))
    let candidate = Math.max(1, start)
    while (used.has(candidate)) {
        candidate += 1
    }
    return candidate
}

function migrateTask(raw: Record<string, unknown>): Task {
    return {
        id: (raw.id as string) ?? '0',
        title: (raw.title as string) ?? '',
        description: (raw.description as string) ?? '',
        status: (raw.status as TaskStatus) ?? '未着手',
        workType: (raw.workType as WorkType) ?? 'コード生成',
        createdAt: (raw.createdAt as string) ?? new Date().toISOString(),
        completedAt: raw.completedAt as string | undefined,
        tags: (raw.tags as TaskTag[]) ?? [],
        starred: (raw.starred as boolean) ?? false,
        estimatedMinutes: (raw.estimatedMinutes as number | null) ?? null,
        scheduledStart: (raw.scheduledStart as string | null) ?? null,
        scheduledEnd: (raw.scheduledEnd as string | null) ?? null,
        section: (raw.section as TaskSection) ?? '終日',
        memos: (raw.memos as any[]) ?? [],
    }
}

export function useTaskManager() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [nextId, setNextId] = useState(1)
    const [idPrefix, setIdPrefix] = useState(DEFAULT_ID_PREFIX)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            const storedPrefix = localStorage.getItem(ID_PREFIX_STORAGE_KEY)

            if (storedPrefix !== null) {
                setIdPrefix(storedPrefix)
            }

            if (stored) {
                const parsedTasks = JSON.parse(stored) as Record<string, unknown>[]
                const migratedTasks = parsedTasks.map(migrateTask)
                const normalizedTasks = normalizeTaskIds(migratedTasks)
                setTasks(normalizedTasks)
                const maxId = normalizedTasks.reduce((max: number, task: Task) => Math.max(max, extractNumericId(task.id)), 0)
                setNextId(maxId + 1)
            }
        } catch (error) {
            console.error('Failed to load tasks:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
            localStorage.setItem(ID_PREFIX_STORAGE_KEY, idPrefix)
        }
    }, [tasks, idPrefix, isLoading])

    const addTask = (
        title: string,
        description: string,
        status: TaskStatus,
        workType: WorkType,
        tags: TaskTag[] = [],
        estimatedMinutes: number | null = null,
        scheduledStart: string | null = null,
        scheduledEnd: string | null = null,
        section: TaskSection = '終日',
    ) => {
        const uniqueId = getNextUniqueId(nextId, tasks)
        const newTask: Task = {
            id: uniqueId.toString(),
            title,
            description,
            status,
            workType,
            createdAt: new Date().toISOString(),
            tags,
            starred: false,
            estimatedMinutes,
            scheduledStart,
            scheduledEnd,
            section,
            memos: [],
        }
        setTasks((prevTasks) => [newTask, ...prevTasks])
        setNextId(uniqueId + 1)
    }

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, ...updates } : task
            )
        )
    }

    const updateTaskStatus = (id: string, status: TaskStatus) => {
        updateTask(id, {
            status,
            completedAt: status === '完了' ? new Date().toISOString() : undefined,
        })
    }

    const toggleStar = (id: string) => {
        const task = tasks.find((t) => t.id === id)
        if (task) {
            updateTask(id, { starred: !task.starred })
        }
    }

    const addTasksBulk = (
        taskInputs: Array<{
            title: string
            description: string
            status: TaskStatus
            workType: WorkType
            tags?: TaskTag[]
            estimatedMinutes?: number | null
            scheduledStart?: string | null
            scheduledEnd?: string | null
            section?: TaskSection
        }>,
    ) => {
        setTasks((prevTasks) => {
            let currentId = getNextUniqueId(nextId, prevTasks)
            const newTasks: Task[] = taskInputs.map((input) => {
                const task: Task = {
                    id: currentId.toString(),
                    title: input.title,
                    description: input.description,
                    status: input.status,
                    workType: input.workType,
                    createdAt: new Date().toISOString(),
                    tags: input.tags ?? [],
                    starred: false,
                    estimatedMinutes: input.estimatedMinutes ?? null,
                    scheduledStart: input.scheduledStart ?? null,
                    scheduledEnd: input.scheduledEnd ?? null,
                    section: input.section ?? '終日',
                    memos: [],
                }
                currentId++
                return task
            })
            setNextId(currentId)
            return [...newTasks, ...prevTasks]
        })
    }

    const addMemo = (taskId: string, text: string) => {
        const task = tasks.find((t) => t.id === taskId)
        if (!task) return
        
        const newMemo = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            text,
            createdAt: new Date().toISOString(),
        }
        updateTask(taskId, { memos: [...task.memos, newMemo] })
    }

    const removeMemo = (taskId: string, memoId: string) => {
        const task = tasks.find((t) => t.id === taskId)
        if (task) {
            updateTask(taskId, {
                memos: task.memos.filter((m) => m.id !== memoId)
            })
        }
    }

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    return {
        tasks,
        idPrefix,
        setIdPrefix,
        nextId,
        isLoading,
        addTask,
        addTasksBulk,
        updateTask,
        updateTaskStatus,
        toggleStar,
        addMemo,
        removeMemo,
        deleteTask,
    }
}
