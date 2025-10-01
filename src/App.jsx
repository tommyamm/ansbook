import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { BookOpen, Code, Download, Copy, CheckCircle, FileText } from 'lucide-react'
import './App.css'
import 'highlight.js/styles/github.css'

function App() {
  const [taskContent, setTaskContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Загружаем содержимое файла с заданием
    import('/src/assets/task1.md?raw')
      .then(module => {
        setTaskContent(module.default)
        setLoading(false)
      })
      .catch(error => {
        console.error('Ошибка загрузки задания:', error)
        setLoading(false)
      })
  }, [])

  const copyCode = async () => {
    // Извлекаем код Python из markdown
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка задания...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Задания по информатике</h1>
              <p className="text-muted-foreground">Сборник разобранных задач с решениями</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 task-header">
                <Code className="h-5 w-5" />
                Задание с решением
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  КЕГЭ №21719
                </Badge>
                <Badge variant="outline">Python</Badge>
              </div>
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Кастомизация компонентов для лучшего отображения
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-primary mb-4 mt-6" {...props} />,
                  h4: ({node, ...props}) => <h4 className="text-lg font-semibold text-foreground mb-3 mt-5" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-foreground leading-relaxed" {...props} />,
                  code: ({node, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    )
                  },
                  pre: ({node, ...props}) => (
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                    </div>
                  ),
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />
                  ),
                }}
              >
                {taskContent}
              </ReactMarkdown>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t">
              <Button variant="outline" className="flex items-center gap-2 action-button">
                <Download className="h-4 w-4" />
                Скачать входные данные
              </Button>
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
              <Button variant="default" className="flex items-center gap-2 action-button">
                <Code className="h-4 w-4" />
                Запустить код
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">
            © 2025 Задания по информатике. Создано для учебных целей.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
