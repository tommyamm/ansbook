import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { useTaskLoader } from '@/components/TaskLoader.jsx'
import { 
  Code, 
  Download, 
  Copy, 
  CheckCircle, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react'
import 'highlight.js/styles/github.css'

// Функция для обработки LaTeX формул в тексте
const processMathInText = (children) => {
  if (typeof children === 'string') {
    // Обрабатываем inline формулы $...$ и block формулы $$...$$
    const parts = children.split(/(\$\$[^$]*\$\$|\$[^$]*\$)/g)
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block формула
        const formula = part.slice(2, -2)
        return <BlockMath key={index} math={formula} />
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline формула
        const formula = part.slice(1, -1)
        return <InlineMath key={index} math={formula} />
      }
      return part
    })
  }
  
  if (Array.isArray(children)) {
    return children.map((child, index) => {
      if (typeof child === 'string') {
        return processMathInText(child)
      }
      return child
    })
  }
  
  return children
}

function TaskPage() {
  const { taskSlug } = useParams()
  const navigate = useNavigate()
  const { tasks, loading: tasksLoading, loadTaskContent, loadDataFile } = useTaskLoader()
  const [currentTask, setCurrentTask] = useState(null)
  const [taskContent, setTaskContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [allTasks, setAllTasks] = useState([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1)

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
    if (allTasks.length > 0 && taskSlug) {
      const taskIndex = allTasks.findIndex(task => task.slug === taskSlug)
      if (taskIndex !== -1) {
        setCurrentTaskIndex(taskIndex)
        setCurrentTask(allTasks[taskIndex])
      } else {
        // Если задача не найдена, перенаправляем на главную
        navigate('/')
      }
    }
  }, [allTasks, taskSlug, navigate])

  // Загружаем содержимое задачи
  useEffect(() => {
    if (currentTask) {
      loadTask(currentTask)
    }
  }, [currentTask])

  const loadTask = async (task) => {
    setLoading(true)
    try {
      const content = await loadTaskContent(task)
      setTaskContent(content)
    } catch (error) {
      console.error('Ошибка загрузки задания:', error)
      setTaskContent('# Ошибка загрузки задания\n\nНе удалось загрузить содержимое задания.')
    }
    setLoading(false)
  }

  const copyCode = async () => {
    const codeMatch = taskContent.match(/```python\n([\s\S]*?)\n```/)
    if (codeMatch) {
      try {
        await navigator.clipboard.writeText(codeMatch[1])
        setCopied(true)
        setTimeout(() => setCopied(false), 1700)
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }
  }

  const downloadDataFile = async () => {
    if (currentTask?.dataFile) {
      try {
        const content = await loadDataFile(currentTask)
        if (content) {
          const blob = new Blob([content], { type: 'text/plain' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = currentTask.dataFile.split('/').pop()
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error('Ошибка скачивания файла:', error)
      }
    }
  }

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

  if (tasksLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка заданий...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка задания...</p>
        </div>
      </div>
    )
  }

  if (!currentTask) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Задание не найдено</h3>
          <p className="text-muted-foreground mb-4">Запрашиваемое задание не существует</p>
          <Button onClick={goHome}>
            <Home className="h-4 w-4 mr-2" />
            На главную
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="border-b bg-card p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={goHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Главная
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {currentTask.type}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="font-medium">{currentTask.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToTask('prev')}
              disabled={currentTaskIndex <= 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Назад
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentTaskIndex + 1} из {allTasks.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToTask('next')}
              disabled={currentTaskIndex >= allTasks.length - 1}
            >
              Вперед
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Task Content */}
      <main className="p-6">
        <Card className="max-w-4xl mx-auto card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 task-header">
                <Code className="h-5 w-5" />
                {currentTask.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {currentTask.type}
                </Badge>
                <Badge variant="secondary">Python</Badge>
              </div>
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-primary mb-4 mt-6" {...props} />,
                  h4: ({node, ...props}) => <h4 className="text-lg font-semibold text-foreground mb-3 mt-5" {...props} />,
                  p: ({node, children, ...props}) => {
                    // Обрабатываем формулы в параграфах
                    const processedChildren = processMathInText(children)
                    return <p className="mb-4 text-foreground leading-relaxed" {...props}>{processedChildren}</p>
                  },
                  code: ({node, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    )
                  },
                  pre: ({node, ...props}) => (
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                    </div>
                  ),
                  img: ({node, src, alt, ...props}) => {
                    const [imageError, setImageError] = useState(false)
                    
                    if (imageError) {
                      return (
                        <div className="flex flex-col items-center my-6 p-8 border-2 border-dashed border-muted-foreground rounded-lg">
                          <p className="text-muted-foreground text-center">
                            Изображение не загружено: {alt || 'изображение'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Путь: {src}
                          </p>
                        </div>
                      )
                    }
                    
                    return (
                      <div className="flex flex-col items-center my-6">
                        <img 
                          src={src} 
                          alt={alt} 
                          className="max-w-full h-auto rounded-lg shadow-lg border border-border"
                          loading="lazy"
                          onError={() => setImageError(true)}
                          {...props}
                        />
                        {/* Подпись для изображений*/}
                        {alt && (
                          <p className="text-sm text-muted-foreground mt-2 text-center italic max-w-md">
                            {alt}
                          </p>
                        )}
                      </div>
                    )
                  },
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />
                  ),
                }}
              >
                {taskContent}
              </ReactMarkdown>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t">
              {currentTask.dataFile && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 action-button"
                  onClick={downloadDataFile}
                >
                  <Download className="h-4 w-4" />
                  Скачать входные данные
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex items-center gap-2 action-button"
                onClick={copyCode}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Копировать код
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default TaskPage
