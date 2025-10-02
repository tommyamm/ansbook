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
        "dataFile": "type_2/ogurets/26_21719.txt"
      },
    ]
  },
    {
    "type": "Тип 26",
    "tasks": [
      {
        "name": "ОлегМонгол",
        "mdFile": "type_26/olegmongol/olegmongol.md"
      }
    ]
  },
//   {
//     "type": "Тип 26",
//     "tasks": [
//       {
//         "name": "SUUUUU",
//         "mdFile": "Тип 26/SUUUUU/SUUUUU.md"
//       },
//       {
//         "name": "БабаКапа",
//         "mdFile": "Тип 26/БабаКапа/БабаКапа.md"
//       },
//       {
//         "name": "Кринж",
//         "mdFile": "Тип 26/Кринж/Кринж.md"
//       }
//     ]
//   },
//   {
//     "type": "Тип 27",
//     "tasks": [
//       {
//         "name": "КрисаЛариса",
//         "mdFile": "Тип 27/КрисаЛариса/КрисаЛариса.md"
//       },
//       {
//         "name": "Мондавожка",
//         "mdFile": "Тип 27/Мондавожка/Мондавожка.md"
//       }
//     ]
//   }
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
        const response = await fetch(`/src/assets/types/${task.dataFile}`)
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