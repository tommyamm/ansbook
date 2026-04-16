import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Code, FileText } from 'lucide-react'
import MarkdownRenderer from '@/components/markdown/MdRender.jsx'

const TaskView = ({ currentTask, taskContent, tasks }) => {
    if (!currentTask) return null

    const taskType = tasks.find(type =>
        type.tasks.some(task => task.name === currentTask.name)
    )?.type

    return (
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
                            {taskType}
                        </Badge>
                        <Badge variant="secondary">Python</Badge>
                    </div>
                </div>
                <Separator className="mt-4" />
            </CardHeader>
            <CardContent>
                <MarkdownRenderer content={taskContent} />
            </CardContent>
        </Card>
    )
}

export default TaskView