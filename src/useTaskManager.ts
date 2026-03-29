import { useState, useEffect } from 'react'
import { type Task, type TaskStatus, type WorkType } from './types'

const STORAGE_KEY = 'tasks'

export function useTaskManager() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [nextId, setNextId] = useState(1)

    // ローカルストレージから読み込み
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsedTasks = JSON.parse(stored)
                setTasks(parsedTasks)
                const maxId = parsedTasks.length > 0
                    ? Math.max(...parsedTasks.map((t: Task) => parseInt(t.id)))
                    : 0
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
        }
    }, [tasks, isLoading])

    const addTask = (title: string, description: string, status: TaskStatus, workType: WorkType) => {
        const newTask: Task = {
            id: nextId.toString(),
            title,
            description,
            status,
            workType,
            createdAt: new Date().toISOString(),
        }
        setTasks([newTask, ...tasks])
        setNextId(nextId + 1)
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
        isLoading,
        addTask,
        updateTaskStatus,
        deleteTask,
    }
}
