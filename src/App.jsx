import { useState, useEffect } from 'react'
import 'katex/dist/katex.min.css'
import MarkdownRenderer from '@/components/MarkdownRenderer.jsx'
// import AnimatedBackground from '@/components/AnimatedBackground.jsx'
import ConfettiEffect from '@/components/ConfettiEffect.jsx'
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
  ChevronRight,
  Sun,
  Moon,
  Users,
  MessageCircle,
  PartyPopper
} from 'lucide-react'
import './App.css'
import 'highlight.js/styles/github.css'


function App() {
  const { tasks, loading: tasksLoading, loadTaskContent } = useTaskLoader()
  const isMobile = useIsMobile()
  const [currentTask, setCurrentTask] = useState(null)
  const [taskContent, setTaskContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedTypes, setExpandedTypes] = useState({})
  
  // Состояния для эффектов
  const [confettiTrigger, setConfettiTrigger] = useState(false)
  const [confettiEnabled, setConfettiEnabled] = useState(false)

  const toggleConfetti = () => {
    setConfettiEnabled(prev => !prev)
    setConfettiTrigger(prev => !prev)
  }

  const onConfettiComplete = () => {
    setConfettiTrigger(false)
  }

  const [tasksCompleted, setTasksCompleted] = useState(0)
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return JSON.parse(saved)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  // useEffect(() => {
  //   if (tasks.length > 0) {
  //     // Разворачиваем все типы по умолчанию
  //     const expanded = {}
  //     tasks.forEach(type => {
  //       expanded[type.type] = true
  //     })
  //     setExpandedTypes(expanded)
      
  //     if (tasks[0].tasks.length > 0) {
  //       loadTask(tasks[0].tasks[0])
  //     }
  //   }
  // }, [tasks])

  const loadTask = async (task) => {
    setCurrentTask(task)
    setLoading(true)
    
    // Закрываем sidebar на мобильных устройствах при выборе задания
    if (isMobile) {
      setSidebarOpen(false)
    }
    
    try {
      const content = await loadTaskContent(task)
      setTaskContent(content)
      
      // Увеличиваем счетчик выполненных задач
      setTasksCompleted(prev => prev + 1)
    } catch (error) {
      console.error('Ошибка загрузки задания:', error)
      setTaskContent('# Ошибка загрузки задания\n\nНе удалось загрузить содержимое задания.')
    }
    setLoading(false)
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
    <div className="min-h-screen bg-background flex relative">
      {/* Анимированный фон */}
      {/* <AnimatedBackground /> */}
      
      {/* Конфетти эффект */}
      {confettiEnabled && (
        <ConfettiEffect 
          trigger={confettiTrigger} 
          // onComplete={onConfettiComplete} 
        />
      )}
      
      {/* Overlay для мобильных устройств */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } w-80`
          : `${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300`
        } 
        border-r bg-card overflow-hidden
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Списочек задач</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className={isMobile ? "" : "hidden"}
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
<header className="border-b bg-card p-4 relative">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <BookOpen className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <h1 
                className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => setCurrentTask(null)}
              >
                StasikHub
              </h1>
            </div>
            <div className={`absolute top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 ${sidebarOpen ? 'left-[calc(40%+10rem)] -translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}>
              <Button
                variant={confettiEnabled ? "secondary" : "ghost"}
                size="sm"
                onClick={toggleConfetti}
              >
                <PartyPopper className="h-4 w-4"/>
              </Button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open("https://t.me/macronx", "_blank")}
              >
                <svg 
                  className="h-4 w-4 text-[#229ED9]" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.5 3.37-.52.36-.99.54-1.41.53-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.48 1.03-.74 4.03-1.75 6.72-2.91 8.07-3.48 3.85-1.63 4.64-1.92 5.17-1.93.11 0 .37.03.54.18.14.12.18.28.2.45-.02.14-.02.3-.03.44z"/>
                </svg>
                @macronx
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
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
                    <Badge variant="secondary">Python</Badge>
                  </div>
                </div>
                <Separator className="mt-4" />
              </CardHeader>
              <CardContent>
                <MarkdownRenderer content={taskContent} />
                
                {/* Action buttons */}
                {/* <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t">
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
                </div> */}
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-4xl mx-auto p-6 space-y-8">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <BookOpen className="h-12 w-12 text-primary" />
                  <h1 
                    className="text-4xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setCurrentTask(null)}
                  >
                    StasikHub
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Добро пожаловать в StasikHub — здесь можно посмотреть шаблон решения задач из ЕГЭ по информатике.
                </p>
              </div>

              {/* About Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      Что такое StasikHub?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      StasikHub — это платформа, созданная для помощи в подготовке к ЕГЭ по информатике. 
                      Здесь вы найдете задачи, сгруппированные по типам, с решениями на Python.
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Цели проекта
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Моя цель — сохранить и систематизировать решения, чтобы у вас всегда был доступ к ним.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Features */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Возможности платформы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Структурированные задачи</h3>
                      <p className="text-sm text-muted-foreground">
                        Задачи организованы по типам для удобного просмотра
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Примеры решений</h3>
                      <p className="text-sm text-muted-foreground">
                        Подробные объяснения и готовые решения на Python
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Поддержка</h3>
                      <p className="text-sm text-muted-foreground">
                        Быстрая помощь и обратная связь через Telegram
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Getting Started */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Как начать?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Выберите интересующую вас категорию задач в боковом меню и начните просмотр. 
                    Каждая задача содержит подробное описание, а также готовое решение с объяснениями.
                  </p>
                </CardContent>
              </Card>

              {/* Support Section */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Нужна помощь?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Если у вас возникли вопросы, вы нашли ошибку или хотите предложить улучшение, 
                    не стесняйтесь обращаться в Telegram. Я всегда рад помочь!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => window.open('https://t.me/macronx', '_blank')}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Написать в Telegram
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* Footer */}
        {/* <footer className="border-t bg-card p-4">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 StasikHub.
          </p>
        </footer> */}
      </div>
    </div>
  )
}

export default App