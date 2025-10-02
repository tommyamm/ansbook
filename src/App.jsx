import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Input } from '@/components/ui/input.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { useTaskLoader } from '@/components/TaskLoader.jsx'
import { 
  BookOpen, 
  Code, 
  Download, 
  Copy, 
  CheckCircle, 
  FileText, 
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import './App.css'
import 'highlight.js/styles/github.css'

function App() {
  const { tasks, loading: tasksLoading, loadTaskContent, loadDataFile } = useTaskLoader()
  const [currentTask, setCurrentTask] = useState(null)
  const [taskContent, setTaskContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedTypes, setExpandedTypes] = useState({})

  useEffect(() => {
    if (tasks.length > 0) {
      // Разворачиваем все типы по умолчанию
      const expanded = {}
      tasks.forEach(type => {
        expanded[type.type] = true
      })
      setExpandedTypes(expanded)
      
      // Загружаем первое задание по умолчанию
      if (tasks[0].tasks.length > 0) {
        loadTask(tasks[0].tasks[0])
      }
    }
  }, [tasks])

  const loadTask = async (task) => {
    setCurrentTask(task)
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
        setTimeout(() => setCopied(false), 2000)
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

  const toggleTypeExpansion = (typeTitle) => {
    setExpandedTypes(prev => ({
      ...prev,
      [typeTitle]: !prev[typeTitle]
    }))
  }

  const filteredTasks = tasks.map(type => ({
    ...type,
    tasks: type.tasks.filter(task => 
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(type => type.tasks.length > 0)

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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r bg-card overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Списочек заданий</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tasks Navigation */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {filteredTasks.map((type, typeIndex) => (
                <div key={typeIndex} className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                    onClick={() => toggleTypeExpansion(type.type)}
                  >
                    <span className="font-medium">{type.type}</span>
                    {expandedTypes[type.type] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {expandedTypes[type.type] && (
                    <div className="ml-4 space-y-1">
                      {type.tasks.map((task, taskIndex) => (
                        <Button
                          key={taskIndex}
                          variant={currentTask?.name === task.name ? "secondary" : "ghost"}
                          className="w-full justify-start p-2 h-auto text-sm"
                          onClick={() => loadTask(task)}
                        >
                          <FileText className="h-3 w-3 mr-2" />
                          {task.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">StasikHub</h1>
              <p className="text-muted-foreground">Тут лежат разобранные задачки по информатике :)</p>
            </div>
          </div>
        </header>

        {/* Task Content */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Загрузка задания...</p>
              </div>
            </div>
          ) : currentTask ? (
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
                      {tasks.find(type => type.tasks.some(task => task.name === currentTask.name))?.type}
                    </Badge>
                    <Badge variant="outline">Python</Badge>
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
                      p: ({node, ...props}) => <p className="mb-4 text-foreground leading-relaxed" {...props} />,
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
                  <Button variant="default" className="flex items-center gap-2 action-button">
                    <Code className="h-4 w-4" />
                    Запустить код
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Выберите задание</h3>
                <p className="text-muted-foreground">Выберите задание из бокового меню для просмотра</p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t bg-card p-4">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 Задания по информатике. Создано для учебных целей.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App