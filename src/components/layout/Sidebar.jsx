import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { ScrollArea } from '@/components/ui/scroll.jsx'
import { Search, X, ChevronDown, ChevronRight, FileText } from 'lucide-react'

const Sidebar = ({
    isOpen,
    isMobile,
    tasks,
    currentTask,
    searchTerm,
    expandedTypes,
    onClose,
    onSearchChange,
    onToggleType,
    onSelectTask,
}) => {
    const filteredTasks = tasks
        .map((type) => ({
            ...type,
            tasks: type.tasks.filter((task) =>
                task.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        }))
        .filter((type) => type.tasks.length > 0)

    return (
        <div
            className={`
                ${isMobile
                    ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-80`
                    : `${isOpen ? 'w-80' : 'w-0'} transition-all duration-300`
                }
                border-r bg-card overflow-hidden
            `}
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Списочек задач</h2>
                    {isMobile && (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Поиск по названию..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-2">
                        {filteredTasks.map((type, typeIndex) => (
                            <div key={typeIndex} className="space-y-1">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between p-2 h-auto"
                                    onClick={() => onToggleType(type.type)}
                                >
                                    <span className="font-medium">{type.type}</span>
                                    {expandedTypes[type.type]
                                        ? <ChevronDown className="h-4 w-4" />
                                        : <ChevronRight className="h-4 w-4" />
                                    }
                                </Button>

                                {expandedTypes[type.type] && (
                                    <div className="ml-4 space-y-1">
                                        {type.tasks.map((task, taskIndex) => (
                                            <Button
                                                key={taskIndex}
                                                variant={currentTask?.name === task.name ? 'secondary' : 'ghost'}
                                                className="w-full justify-start p-2 h-auto text-sm"
                                                onClick={() => onSelectTask(task)}
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
    )
}

export default Sidebar