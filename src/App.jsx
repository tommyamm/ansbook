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
import { useIsMobile } from '@/hooks/use-mobile.js'
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
  const isMobile = useIsMobile()
  const [currentTask, setCurrentTask] = useState(null)
  const [taskContent, setTaskContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedTypes, setExpandedTypes] = useState({})

  useEffect(() => {
    if (tasks.length > 0) {
      const expanded = {}
      tasks.forEach(type => {
        expanded[type.type] = true
      })
      setExpandedTypes(expanded)
      
      if (tasks[0].tasks.length > 0) {
        loadTask(tasks[0].tasks[0])
      }
    }
  }, [tasks])

  const loadTask = async (task) => {
    setCurrentTask(task)
    setLoading(true)
    
    // Закрываем sidebar на мобильных после выбора задания
    if (isMobile) {
      setSidebarOpen(false)
    }
    
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
      {/* Overlay для мобильных устройств */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isMobile ? 'fixed' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          w-80
          h-screen
          border-r 
          bg-card
          transition-transform 
          duration-300 
          ease-in-out
          ${isMobile ? 'z-50' : 'z-0'}
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Списочек заданий</h2>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tasks Navigation */}
          <ScrollArea className="flex-1 -mx-4 px-4">
            <div className="space-y-2">
              {filteredTasks.map((type, typeIndex) => (
                <div key={typeIndex} className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                    onClick={() => toggleTypeExpansion(type.type)}
                  >
                    <span className="font-medium text-left">{type.type}</span>
                    {expandedTypes[type.type] ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                  </Button>
                  
                  {expandedTypes[type.type] && (
                    <div className="ml-2 space-y-1">
                      {type.tasks.map((task, taskIndex) => (
                        <Button
                          key={taskIndex}
                          variant={currentTask?.name === task.name ? "secondary" : "ghost"}
                          className="w-full justify-start p-2 h-auto text-sm"
                          onClick={() => loadTask(task)}
                        >
                          <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="text-left break-words">{task.name}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b bg-card p-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                StasikHub
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Тут лежат разобранные задачки по информатике :)
              </p>
            </div>
          </div>
        </header>

        {/* Task Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Загрузка задания...</p>
                </div>
              </div>
            ) : currentTask ? (
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <div className="space-y-3">
                    <CardTitle className="flex items-start gap-2 text-lg sm:text-xl">
                      <Code className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span className="break-words">{currentTask.name}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs">
                          {tasks.find(type => type.tasks.some(task => task.name === currentTask.name))?.type}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">Python</Badge>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </CardHeader>
                
                <CardContent>
                  <div className="prose prose-sm sm:prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        h3: ({node, ...props}) => (
                          <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 mt-6" {...props} />
                        ),
                        h4: ({node, ...props}) => (
                          <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 mt-4" {...props} />
                        ),
                        p: ({node, ...props}) => (
                          <p className="mb-4 text-foreground leading-relaxed text-sm sm:text-base" {...props} />
                        ),
                        code: ({node, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '')
                          return match ? (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          ) : (
                            <code className="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono" {...props}>
                              {children}
                            </code>
                          )
                        },
                        pre: ({node, ...props}) => (
                          <div className="relative -mx-4 sm:mx-0">
                            <pre className="bg-slate-900 text-slate-100 p-3 sm:p-4 rounded-none sm:rounded-lg overflow-x-auto mb-4 text-xs sm:text-sm" {...props} />
                          </div>
                        ),
                        strong: ({node, ...props}) => (
                          <strong className="font-semibold text-foreground" {...props} />
                        ),
                        blockquote: ({node, ...props}) => (
                          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 text-sm" {...props} />
                        ),
                      }}
                    >
                      {taskContent}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 mt-6 pt-6 border-t">
                    {currentTask.dataFile && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-center gap-2"
                        onClick={downloadDataFile}
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Скачать входные данные</span>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full justify-center gap-2"
                      onClick={copyCode}
                      disabled={copied}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Скопировано!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-sm">Копировать код</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center px-4">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Выберите задание</h3>
                  <p className="text-sm text-muted-foreground">
                    Откройте меню и выберите задание для просмотра
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card p-3 sm:p-4">
          <p className="text-center text-muted-foreground text-xs">
            © 2025 Задания по информатике. Создано для учебных целей.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App