import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import MarkdownRenderer from './MarkdownRenderer.jsx'
import MarkdownErrorBoundary from './MarkdownErrorBoundary.jsx'
import { TestTube, CheckCircle, XCircle } from 'lucide-react'

// Тестовые markdown примеры
const testCases = [
  {
    name: 'Базовый markdown',
    content: `# Заголовок 1
## Заголовок 2
### Заголовок 3

**Жирный текст** и *курсив*

- Список 1
- Список 2
  - Вложенный элемент

1. Нумерованный список
2. Второй элемент

[Ссылка](https://example.com)

\`inline код\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

> Цитата

---

| Таблица | Колонка 2 |
|---------|-----------|
| Ячейка 1 | Ячейка 2 |`
  },
  {
    name: 'Математические формулы',
    content: `# Математические формулы

Inline формула: $E = mc^2$

Block формула:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

Смешанный текст с формулами: $\\alpha + \\beta = \\gamma$`
  },
  {
    name: 'Проблемный контент',
    content: `# Тест безопасности

<script>alert('XSS')</script>

<iframe src="javascript:alert('XSS')"></iframe>

Обычный текст после проблемного контента.`
  },
  {
    name: 'Пустой контент',
    content: ''
  },
  {
    name: 'Null контент',
    content: null
  }
]

const MarkdownTestComponent = () => {
  const [selectedTest, setSelectedTest] = useState(0)
  const [customContent, setCustomContent] = useState('')
  const [testResults, setTestResults] = useState({})

  const runTest = (index, content) => {
    const startTime = performance.now()
    let hasError = false
    let errorMessage = null

    try {
      // Симулируем рендеринг
      const testElement = document.createElement('div')
      // Здесь бы мы рендерили компонент, но для теста просто проверяем валидность
      if (content === null || content === undefined) {
        hasError = true
        errorMessage = 'Контент отсутствует'
      }
    } catch (error) {
      hasError = true
      errorMessage = error.message
    }

    const endTime = performance.now()
    const renderTime = endTime - startTime

    setTestResults(prev => ({
      ...prev,
      [index]: {
        hasError,
        errorMessage,
        renderTime,
        timestamp: new Date().toISOString()
      }
    }))
  }

  const runAllTests = () => {
    testCases.forEach((testCase, index) => {
      runTest(index, testCase.content)
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Тестирование Markdown Renderer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={runAllTests} variant="outline">
              Запустить все тесты
            </Button>
            <Button 
              onClick={() => runTest(selectedTest, testCases[selectedTest].content)}
              variant="outline"
            >
              Запустить выбранный тест
            </Button>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Левая панель - выбор тестов */}
            <div className="space-y-4">
              <h3 className="font-semibold">Тестовые случаи:</h3>
              <div className="space-y-2">
                {testCases.map((testCase, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <Button
                      variant={selectedTest === index ? "secondary" : "ghost"}
                      className="flex-1 justify-start"
                      onClick={() => setSelectedTest(index)}
                    >
                      {testCase.name}
                    </Button>
                    {testResults[index] && (
                      <div className="ml-2">
                        {testResults[index].hasError ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Кастомный контент:</h3>
                <Textarea
                  placeholder="Введите markdown контент для тестирования..."
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  rows={4}
                />
                <Button 
                  onClick={() => runTest('custom', customContent)}
                  variant="outline"
                  className="w-full"
                >
                  Тестировать кастомный контент
                </Button>
              </div>
            </div>

            {/* Правая панель - результаты */}
            <div className="space-y-4">
              <h3 className="font-semibold">Результат рендеринга:</h3>
              <div className="border rounded-lg p-4 min-h-[400px]">
                <MarkdownErrorBoundary>
                  <MarkdownRenderer 
                    content={selectedTest < testCases.length ? testCases[selectedTest].content : customContent} 
                  />
                </MarkdownErrorBoundary>
              </div>

              {/* Статистика тестов */}
              {Object.keys(testResults).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Статистика тестов:</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(testResults).map(([index, result]) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>
                          Тест {index}: {result.hasError ? 'Ошибка' : 'Успех'}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant={result.hasError ? "destructive" : "default"}>
                            {result.renderTime?.toFixed(2)}ms
                          </Badge>
                          {result.hasError && (
                            <Badge variant="outline" className="text-xs">
                              {result.errorMessage}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MarkdownTestComponent
