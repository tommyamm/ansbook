import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import { Badge } from '@/components/ui/Badge.jsx'
import { Separator } from '@/components/ui/Separator.jsx'
import { Code, FileText } from 'lucide-react'
import MarkdownRenderer from '@/components/markdown/MdRender.jsx'

const TaskView = ({ currentTask, taskContent, tasks }) => {
    if (!currentTask) return null

    const taskType = tasks.find(type =>
        type.tasks.some(task => task.name === currentTask.name)
    )

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 task-header">
                        <Code className="h-5 w-5" />
                        {currentTask.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {taskType?.type}
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