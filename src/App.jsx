import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import 'katex/dist/katex.min.css'
import ParticleEffect from '@/components/common/ParticleEffect.jsx'
import { useTasks } from '@/hooks/useTaskLoader.js'
import { useIsMobile } from '@/hooks/useMobile.js'
import './index.css'
import 'highlight.js/styles/github.css'

import Header from '@/components/layout/Header.jsx'
import Sidebar from '@/components/layout/Sidebar.jsx'
import HomePage from '@/pages/HomePage.jsx'
import TaskView from '@/pages/TaskView.jsx'

// Обёртка для TaskView — читает :taskName из URL
function TaskPage({ tasks, loadTaskContent }) {
    const { taskName } = useParams()
    const navigate = useNavigate()
    const [taskContent, setTaskContent] = useState('')
    const [loading, setLoading] = useState(true)

    // Ищем задание по имени (URL-encoded)
    const decodedName = decodeURIComponent(taskName)
    const currentTask = tasks.flatMap(t => t.tasks).find(t => t.name === decodedName)

    useEffect(() => {
        if (!currentTask) return
        setLoading(true)
        loadTaskContent(currentTask)
            .then(content => setTaskContent(content))
            .catch(() => setTaskContent('# Ошибка загрузки задания'))
            .finally(() => setLoading(false))
    }, [currentTask?.name])

    if (!currentTask) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-muted-foreground">Задание не найдено</p>
                    <button className="mt-4 text-primary underline" onClick={() => navigate('/')}>
                        На главную
                    </button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Загрузка задания...</p>
                </div>
            </div>
        )
    }

    return <TaskView currentTask={currentTask} taskContent={taskContent} tasks={tasks} />
}

function App() {
    const { tasks, loading: tasksLoading, loadTaskContent } = useTasks()
    const isMobile = useIsMobile()
    const navigate = useNavigate()
    const location = useLocation()

    const [searchTerm, setSearchTerm] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Сохраняем раскрытые категории в localStorage
    const [expandedTypes, setExpandedTypes] = useState(() => {
        try {
            const saved = localStorage.getItem('expandedTypes')
            return saved ? JSON.parse(saved) : {}
        } catch {
            return {}
        }
    })

    const [particleEnabled, setParticleEnabled] = useState(false)

    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode')
        if (saved !== null) return JSON.parse(saved)
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    const handleExpandAll = () => {
        const allTypes = tasks.reduce((acc, type) => ({ ...acc, [type.type]: true }), {})
        setExpandedTypes(allTypes)
    }

    const handleCollapseAll = () => {
        setExpandedTypes({})
    }
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
        document.documentElement.classList.toggle('dark', darkMode)
    }, [darkMode])

    useEffect(() => {
        setSidebarOpen(!isMobile)
    }, [isMobile])

    useEffect(() => {
        localStorage.setItem('expandedTypes', JSON.stringify(expandedTypes))
    }, [expandedTypes])

    // При поиске — автоматически раскрываем группы с результатами
    useEffect(() => {
        if (!searchTerm) return
        const newExpanded = {}
        tasks.forEach(type => {
            const hasMatch = type.tasks.some(t =>
                t.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            if (hasMatch) newExpanded[type.type] = true
        })
        setExpandedTypes(prev => ({ ...prev, ...newExpanded }))
    }, [searchTerm, tasks])

    const selectTask = (task) => {
        if (isMobile) setSidebarOpen(false)
        navigate(`/task/${encodeURIComponent(task.name)}`)
    }

    const toggleTypeExpansion = (typeTitle) => {
        setExpandedTypes(prev => ({ ...prev, [typeTitle]: !prev[typeTitle] }))
    }

    // Определяем активное задание по URL для подсветки в sidebar
    const activeTaskName = location.pathname.startsWith('/task/')
        ? decodeURIComponent(location.pathname.replace('/task/', ''))
        : null

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
            {particleEnabled && <ParticleEffect trigger={particleEnabled} />}

            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar 
                isOpen={sidebarOpen}
                isMobile={isMobile}
                tasks={tasks}
                activeTaskName={activeTaskName}
                searchTerm={searchTerm}
                expandedTypes={expandedTypes}
                onClose={() => setSidebarOpen(false)}
                onSearchChange={setSearchTerm}
                onToggleType={toggleTypeExpansion}
                onSelectTask={selectTask}
                onExpandAll={handleExpandAll}
                onCollapseAll={handleCollapseAll}
            />

            <div className="flex-1 flex flex-col">
                <Header
                    sidebarOpen={sidebarOpen}
                    darkMode={darkMode}
                    particleEnabled={particleEnabled}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onToggleDarkMode={() => setDarkMode(!darkMode)}
                    onToggleParticles={() => setParticleEnabled(p => !p)}
                    onLogoClick={() => navigate('/')}
                />

                <main className="flex-1 p-6 overflow-auto">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/task/:taskName"
                            element={
                                <TaskPage
                                    tasks={tasks}
                                    loadTaskContent={loadTaskContent}
                                />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default App