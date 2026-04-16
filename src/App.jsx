import { useState, useEffect } from 'react'
import 'katex/dist/katex.min.css'
import ParticleEffect from '@/components/common/ParticleEffect.jsx'
import { useTaskLoader } from '@/hooks/useTaskLoader.js'
import { useIsMobile } from '@/hooks/useMobile.js'
import './index.css'
import 'highlight.js/styles/github.css'

// Layout компоненты
import Header from '@/components/layout/Header.jsx'
import Sidebar from '@/components/layout/Sidebar.jsx'

// Страницы
import HomePage from '@/pages/HomePage.jsx'
import TaskView from '@/pages/TaskView.jsx'

function App() {
    const { tasks, loading: tasksLoading, loadTaskContent } = useTaskLoader()
    const isMobile = useIsMobile()
    const [currentTask, setCurrentTask] = useState(null)
    const [taskContent, setTaskContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [expandedTypes, setExpandedTypes] = useState({})

    // Состояния для эффектов
    const [particleEnabled, setParticleEnabled] = useState(false)

    const toggleParticleEffect = () => {
        setParticleEnabled(prev => !prev)
    }

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
            {/* Particle эффект */}
            {particleEnabled && (
                <ParticleEffect
                    trigger={particleEnabled}
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
            <Sidebar 
                isOpen={sidebarOpen}
                isMobile={isMobile}
                tasks={tasks}
                currentTask={currentTask}
                searchTerm={searchTerm}
                expandedTypes={expandedTypes}
                onClose={() => setSidebarOpen(false)}
                onSearchChange={setSearchTerm}
                onToggleType={toggleTypeExpansion}
                onSelectTask={loadTask}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header 
                    sidebarOpen={sidebarOpen}
                    darkMode={darkMode}
                    particleEnabled={particleEnabled}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onToggleDarkMode={() => setDarkMode(!darkMode)}
                    onToggleParticles={toggleParticleEffect}
                    onLogoClick={() => setCurrentTask(null)}
                />

                {/* Content Area */}
                <main className="flex-1 p-6 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Загрузка задания...</p>
                            </div>
                        </div>
                    ) : currentTask ? (
                        <TaskView 
                            currentTask={currentTask} 
                            taskContent={taskContent} 
                            tasks={tasks} 
                        />
                    ) : (
                        <HomePage onSetCurrentTask={setCurrentTask} />
                    )}
                </main>
            </div>
        </div>
    )
}

export default App
