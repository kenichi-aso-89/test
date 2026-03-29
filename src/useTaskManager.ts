import { useState, useEffect } from 'react'
import { type Task, type TaskStatus, type WorkType } from './types'

const STORAGE_KEY = 'tasks'
const ID_PREFIX_STORAGE_KEY = 'task_id_prefix'
const DEFAULT_ID_PREFIX = 'TASK-'

const extractNumericId = (id: string): number => {
    const matched = id.match(/(\d+)$/)
    return matched ? parseInt(matched[1], 10) : 0
}

const normalizeTaskIds = (loadedTasks: Task[]): Task[] => {
    return loadedTasks.map((task, index) => ({
        ...task,
        id: (index + 1).toString(),
    }))
}

const getNextUniqueId = (start: number, tasks: Task[]): number => {
    const used = new Set(tasks.map((task) => extractNumericId(task.id)).filter((num) => num > 0))
    let candidate = Math.max(1, start)
    while (used.has(candidate)) {
        candidate += 1
    }
    return candidate
}

export function useTaskManager() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [nextId, setNextId] = useState(1)
    const [idPrefix, setIdPrefix] = useState(DEFAULT_ID_PREFIX)

    // ローカルストレージから読み込み
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            const storedPrefix = localStorage.getItem(ID_PREFIX_STORAGE_KEY)

            if (storedPrefix !== null) {
                setIdPrefix(storedPrefix)
            }

            if (stored) {
                const parsedTasks = JSON.parse(stored)
                const normalizedTasks = normalizeTaskIds(parsedTasks)
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

    // ローカルストレージに保存
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
            localStorage.setItem(ID_PREFIX_STORAGE_KEY, idPrefix)
        }
    }, [tasks, idPrefix, isLoading])

    const addTask = (title: string, description: string, status: TaskStatus, workType: WorkType) => {
        const uniqueId = getNextUniqueId(nextId, tasks)
        const newTask: Task = {
            id: uniqueId.toString(),
            title,
            description,
            status,
            workType,
            createdAt: new Date().toISOString(),
        }
        setTasks((prevTasks) => [newTask, ...prevTasks])
        setNextId(uniqueId + 1)
    }

    const updateTaskStatus = (id: string, status: TaskStatus) => {
        setTasks(
            tasks.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        status,
                        completedAt: status === '完了' ? new Date().toISOString() : undefined,
                    }
                    : task
            )
        )
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
        updateTaskStatus,
        deleteTask,
    }
}
