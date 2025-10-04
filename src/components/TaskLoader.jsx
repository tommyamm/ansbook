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
    "type": "Тип 26",
    "tasks": [
      {
        "name": "ОлегМонгол",
        "mdFile": "type_26/olegmongol/olegmongol.md",
        "dataFile": "type_26/olegmongol/26_21719.txt",
      }
    ]
  },
  {
    "type": "Тип 27",
    "tasks": [
      {
        "name": "Бухляш",
        "mdFile": "type_27/bukhlyash/bukhlyash.md",
        "dataFile": "type_27/bukhlyash/27_A_23571.txt",
      },
      {
        "name": "Бабакапа",
        "mdFile": "type_27/babacapa/babacapa.md",
        "dataFile": "type_27/babacapa/27B_18677.txt",
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
      const response = await fetch(`/ansbook/src/assets/types/${task.mdFile}`)
      if (response.ok) {
        return await response.text()
      } else {
        // Если файл не найден, возвращаем заглушку
        return `### Задание: ${task.name}

Это задание из категории "${tasks.find(type => type.tasks.some(t => t.name === task.name))?.type}".

Содержимое задания пока не загружено.

#### Пример решения

\`\`\`python
def solve_${task.name.toLowerCase()}():
    # Здесь будет решение задачи "${task.name}"
    pass

print(solve_${task.name.toLowerCase()}())
\`\`\`
`
      }
    } catch (error) {
      console.error('Ошибка загрузки задания:', error)
      return `# Ошибка загрузки

Не удалось загрузить содержимое задания "${task.name}".

Проверьте, что файл \`${task.mdFile}\` существует в директории assets.`
    }
  }

  const loadDataFile = async (task) => {
    try {
      if (task.dataFile) {
        const response = await fetch(`/ansbook/src/assets/types/${task.dataFile}`)
        if (response.ok) {
          return await response.text()
        }
      }
      return null
    } catch (error) {
      console.error('Ошибка загрузки файла данных:', error)
      return null
    }
  }

  return {
    tasks,
    loading,
    loadTaskContent,
    loadDataFile
  }
}

export default useTaskLoader