import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import { Badge } from '@/components/ui/Badge.jsx'
import { Separator } from '@/components/ui/Separator.jsx'
import MarkdownRenderer from '@/components/markdown/MdRender.jsx'
import { Lightbulb, FileText } from 'lucide-react'

const TipPage = ({ tasks }) => {
    const { typeSlug } = useParams()
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const typeData = tasks.find(t => t.tipSlug === typeSlug)

    useEffect(() => {
        if (!typeData?.tips) {
            setError(true)
            setLoading(false)
            return
        }
        setLoading(true)
        setError(false)
        fetch(typeData.tips)
            .then(r => {
                if (!r.ok) throw new Error()
                return r.text()
            })
            .then(text => setContent(text))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [typeData?.tips])

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 task-header">
                        <Lightbulb
                            className="h-5 w-5 flex-shrink-0"
                            style={{ color: 'var(--tips-color)' }}
                            strokeWidth={1.75}
                        />
                        Советы
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {typeData && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {typeData.type}
                            </Badge>
                        )}
                    </div>
                </div>
                <Separator className="mt-4" />
            </CardHeader>

            <CardContent>
                {loading && (
                    <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                        <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Загрузка...
                    </div>
                )}

                {error && !loading && (
                    <div className="py-6 text-sm text-muted-foreground text-center">
                        Не удалось загрузить советы
                    </div>
                )}

                {!loading && !error && content && (
                    <MarkdownRenderer content={content} />
                )}
            </CardContent>
        </Card>
    )
}

export default TipPage