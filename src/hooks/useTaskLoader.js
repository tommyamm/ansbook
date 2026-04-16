import { useState, useEffect } from 'react'
import { tasksData } from '../../taskConfig.js'

export const useTasks = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            setTasks(tasksData)
        } catch (error) {
            console.error('Ошибка загрузки структуры заданий:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const loadTaskContent = async (task) => {
        try {
            const response = await fetch(task.mdFile)
            if (response.ok) {
                return await response.text()
            }
            return 'Что-то пошло не так!'
        } catch (error) {
            console.error('Ошибка загрузки задания:', error)
            return 'Не удалось загрузить задание!'
        }
    }

    return { tasks, loading, loadTaskContent }
}
