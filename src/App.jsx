import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { useTaskLoader } from '@/components/TaskLoader.jsx'
import { useIsMobile } from '@/hooks/use-mobile.js'
import HomePage from '@/components/HomePage.jsx'
import TaskPage from '@/components/TaskPage.jsx'
import {
  BookOpen,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  FileText
} from 'lucide-react'
import './App.css'

function App() {
  const { tasks, loading: tasksLoading } = useTaskLoader()
  const isMobile = useIsMobile()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedTypes, setExpandedTypes] = useState({})
  
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

  useEffect(() => {
    if (tasks.length > 0) {
      const expanded = {}
      tasks.forEach(type => {
        expanded[type.type] = true
      })
      setExpandedTypes(expanded)
    }
  }, [tasks])

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

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

  const pageVariants = {
    initial: {
      y: "-100vh",
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }, // Равнозамедленное появление
    },
    exit: {
      y: "100vh",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }, // Равноускоренное исчезновение
    },
  };

  return (
    <div className="min-h-screen bg-background flex relative">
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
                      {type.tasks.map((task, taskIndex) => {
                        const taskSlug = task.mdFile.split('/')[1] // Используем название директории как slug
                        const isActive = location.pathname === `/${taskSlug}`
                        
                        return (
                          <Link
                            key={taskIndex}
                            to={`/${taskSlug}`}
                            className="block"
                          >
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              className="w-full justify-start p-2 h-auto text-sm"
                            >
                              <FileText className="h-3 w-3 mr-2" />
                              {task.name}
                            </Button>
                          </Link>
                        )
                      })}
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
            <div className="flex-1">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                  StasikHub
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open('https://t.me/macronx', '_blank')}
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
              className="ml-auto"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Routes with Animation */}
        <main className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <HomePage />
                  </motion.div>
                }
              />
              <Route
                path="/:taskSlug"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <TaskPage />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card p-4">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 StasikHub.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
