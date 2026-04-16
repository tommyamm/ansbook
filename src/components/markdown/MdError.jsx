import { Component } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { AlertTriangle } from 'lucide-react'

class MarkdownErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Markdown rendering error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert className="my-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Произошла ошибка при рендеринге markdown. 
            {this.state.error && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Детали ошибки
                </summary>
                <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

export default MarkdownErrorBoundary
