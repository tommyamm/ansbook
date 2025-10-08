import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTaskLoader } from '@/components/TaskLoader.jsx'

export function useTaskNavigation() {
  const { tasks } = useTaskLoader()
  const location = useLocation()
  const navigate = useNavigate()
  const [allTasks, setAllTasks] = useState([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1)
  const [currentTask, setCurrentTask] = useState(null)

  // Создаем плоский список всех задач для навигации
  useEffect(() => {
    if (tasks.length > 0) {
      const flatTasks = []
      tasks.forEach(type => {
        type.tasks.forEach(task => {
          flatTasks.push({
            ...task,
            type: type.type,
            slug: task.mdFile.split('/')[1] // Используем название директории как slug
          })
        })
      })
      setAllTasks(flatTasks)
    }
  }, [tasks])

  // Находим текущую задачу по slug
  useEffect(() => {
    if (allTasks.length > 0) {
      const pathname = location.pathname
      if (pathname === '/') {
        setCurrentTaskIndex(-1)
        setCurrentTask(null)
        return
      }
      
      const taskSlug = pathname.slice(1) // убираем первый слеш
      const taskIndex = allTasks.findIndex(task => task.slug === taskSlug)
      if (taskIndex !== -1) {
        setCurrentTaskIndex(taskIndex)
        setCurrentTask(allTasks[taskIndex])
      } else {
        setCurrentTaskIndex(-1)
        setCurrentTask(null)
      }
    }
  }, [allTasks, location.pathname])

  const navigateToTask = (direction) => {
    const newIndex = direction === 'prev' ? currentTaskIndex - 1 : currentTaskIndex + 1
    if (newIndex >= 0 && newIndex < allTasks.length) {
      const newTask = allTasks[newIndex]
      navigate(`/${newTask.slug}`)
    }
  }

  const goHome = () => {
    navigate('/')
  }

  return {
    allTasks,
    currentTaskIndex,
    currentTask,
    navigateToTask,
    goHome
  }
}
