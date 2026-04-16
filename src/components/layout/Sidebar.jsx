import { useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, X, ChevronDown, ChevronRight, FileText, ChevronsUpDown, ChevronsDownUp } from 'lucide-react'

const Sidebar = ({
    isOpen,
    isMobile,
    tasks,
    activeTaskName,
    searchTerm,
    expandedTypes,
    onClose,
    onSearchChange,
    onToggleType,
    onSelectTask,
    onExpandAll,
    onCollapseAll,
}) => {
    const listRef = useRef(null)
    const activeRef = useRef(null)

    // Скроллим к активному заданию при открытии sidebar
    useEffect(() => {
        if (isOpen && activeRef.current) {
            activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    }, [isOpen, activeTaskName])

    const filteredTasks = tasks
        .map((type) => ({
            ...type,
            tasks: type.tasks.filter((task) =>
                task.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        }))
        .filter((type) => type.tasks.length > 0)

    const hasResults = filteredTasks.length > 0

    const allExpanded = filteredTasks.length > 0 && filteredTasks.every((type) => expandedTypes[type.type])
    const allCollapsed = filteredTasks.every((type) => !expandedTypes[type.type])

    return (
        <div
            className={`
                ${isMobile
                    ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-80`
                    : `${isOpen ? 'w-80' : 'w-0'} transition-all duration-300`
                }
                border-r bg-card overflow-hidden flex flex-col
            `}
        >
            {/* Шапка sidebar */}
            <div className="p-4 pb-2 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Задания</h2>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            title="Развернуть все"
                            disabled={allExpanded}
                            onClick={onExpandAll}
                        >
                            <ChevronsUpDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            title="Свернуть все"
                            disabled={allCollapsed}
                            onClick={onCollapseAll}
                        >
                            <ChevronsDownUp className="h-3.5 w-3.5" />
                        </Button>
                        {isMobile && (
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-1" onClick={onClose}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Поиск..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* Список — нативный скролл с визуальным fade снизу */}
            <div className="relative flex-1 min-h-0">
                <div
                    ref={listRef}
                    className="h-full overflow-y-auto px-4 pb-4 pt-2"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}
                >
                    {!hasResults && searchTerm ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            <p>Ничего не найдено</p>
                            <p className="text-xs mt-1 opacity-60">по запросу «{searchTerm}»</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredTasks.map((type, typeIndex) => {
                                const isExpanded = expandedTypes[type.type]
                                const hasActive = type.tasks.some(t => t.name === activeTaskName)

                                return (
                                    <div key={typeIndex}>
                                        <Button
                                            variant="ghost"
                                            className={`w-full justify-between p-2 h-auto ${hasActive ? 'text-primary' : ''}`}
                                            onClick={() => onToggleType(type.type)}
                                        >
                                            <span className="font-medium text-sm">{type.type}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 font-normal">
                                                    {type.tasks.length}
                                                </Badge>
                                                {isExpanded
                                                    ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                                    : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                                }
                                            </div>
                                        </Button>

                                        {isExpanded && (
                                            <div className="ml-3 pl-3 border-l border-border space-y-0.5 my-1">
                                                {type.tasks.map((task, taskIndex) => {
                                                    const isActive = task.name === activeTaskName
                                                    return (
                                                        <Button
                                                            key={taskIndex}
                                                            ref={isActive ? activeRef : null}
                                                            variant={isActive ? 'secondary' : 'ghost'}
                                                            className={`w-full justify-start p-2 h-auto text-sm ${isActive ? 'font-medium' : 'font-normal'}`}
                                                            onClick={() => onSelectTask(task)}
                                                        >
                                                            <FileText className={`h-3 w-3 mr-2 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                                            <span className="truncate">{task.name}</span>
                                                        </Button>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Fade-градиент снизу — визуальный сигнал "здесь можно скроллить" */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, transparent, var(--card))'
                    }}
                />
            </div>
        </div>
    )
}

export default Sidebar