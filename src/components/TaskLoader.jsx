// Компонент для динамической загрузки заданий
import { useState, useEffect } from 'react'

// Определяем структуру заданий напрямую
const tasksData = [
  {
    "type": "Тип 2",
    "tasks": [
       {
        "name": "Огурец",
        "mdFile": "type_2/ogurets/ogurets.md",
      },
    ]
  },
  {
    "type": "Тип 14",
    "tasks": [
      {
        "name": "Бублик",
        "mdFile": "type_14/bublik/bublik.md",
      }
    ]
  },
  {
    "type": "Тип 24",
    "tasks": [
      {
        "name": "Тибидох",
        "mdFile": "type_24/tibidokh/tibidokh.md",
      }
    ]
  },
  {
    "type": "Тип 26",
    "tasks": [
      {
        "name": "ОлегМонгол",
        "mdFile": "type_26/olegmongol/olegmongol.md",
      },
      {
        "name": "Кабуня",
        "mdFile": "type_26/kabunya/kabunya.md",
      },
    ]
  },
  {
    "type": "Тип 27",
    "tasks": [
      // {
      //   "name": "Бухляш",
      //   "mdFile": "type_27/bukhlyash/bukhlyash.md",
      // },
      {
        "name": "Бабакапа",
        "mdFile": "type_27/babacapa/babacapa.md",
      },
    ]
  },
]

export const useTaskLoader = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      setTasks(tasksData)
      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки структуры заданий:', error)
      setLoading(false)
    }
  }, [])

  const loadTaskContent = async (task) => {
    try {
      // Пытаемся загрузить файл из assets
      const response = await fetch(`/src/assets/types/${task.mdFile}`)
      if (response.ok) {
        return await response.text()
      } else {
        // Если файл не найден, возвращаем заглушку
        return `Что-то пошло не так!`
      }
    } catch (error) {
      console.error('Ошибка загрузки задания:', error)
      return `Не удалось загрузить задание!`
    }
  }

  return {
    tasks,
    loading,
    loadTaskContent,
  }
}

export default useTaskLoader