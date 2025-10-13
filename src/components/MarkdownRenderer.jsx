import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { InlineMath, BlockMath } from 'react-katex'
import { useMarkdownRenderer, useMarkdownValidation } from '@/hooks/useMarkdownRenderer.js'
import './MarkdownRenderer.css'

// Функция для обработки LaTeX формул в тексте
const processMathInText = (children) => {
  if (typeof children === 'string') {
    // Обрабатываем inline формулы $...$ и block формулы $$...$$
    const parts = children.split(/(\$\$[^$]*\$\$|\$[^$]*\$)/g)
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block формула
        const formula = part.slice(2, -2)
        return <BlockMath key={index} math={formula} />
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline формула
        const formula = part.slice(1, -1)
        return <InlineMath key={index} math={formula} />
      }
      return part
    })
  }
  
  if (Array.isArray(children)) {
    return children.map((child, index) => {
      if (typeof child === 'string') {
        return processMathInText(child)
      }
      return child
    })
  }
  
  return children
}

// Компонент для обработки изображений с обработкой ошибок
const ImageComponent = ({ src, alt, ...props }) => {
  const [imageError, setImageError] = useState(false)
  
  if (imageError) {
    return (
      <div className="flex flex-col items-center my-6 p-8 border-2 border-dashed border-muted-foreground rounded-lg">
        <p className="text-muted-foreground text-center">
          Изображение не загружено: {alt || 'изображение'}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Путь: {src}
        </p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center my-6">
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto rounded-lg shadow-lg border border-border"
        loading="lazy"
        onError={() => setImageError(true)}
        {...props}
      />
      {/* Подпись для изображений */}
      {alt && (
        <p className="text-sm text-muted-foreground mt-2 text-center italic max-w-md">
          {alt}
        </p>
      )}
    </div>
  )
}

// Компонент для кода с подсветкой синтаксиса
const CodeComponent = ({ node, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '')
  return match ? (
    <code className={`${className} hljs`} {...props}>
      {children}
    </code>
  ) : (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  )
}

// Компонент для pre блоков
const PreComponent = ({ node, ...props }) => (
  <div className="relative">
    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4 hljs" {...props} />
  </div>
)

// Компонент для параграфов с обработкой формул
const ParagraphComponent = ({ node, children, ...props }) => {
  const processedChildren = processMathInText(children)
  return <p className="mb-4 text-foreground leading-relaxed" {...props}>{processedChildren}</p>
}

// Компонент для элементов списка с обработкой формул
const ListItemComponent = ({ node, children, ...props }) => {
  const processedChildren = processMathInText(children)
  return <li className="text-foreground" {...props}>{processedChildren}</li>
}

// Основной компонент MarkdownRenderer
const MarkdownRenderer = ({ content, className = "" }) => {
  const processedContent = useMarkdownRenderer(content)
  const { isValid, error } = useMarkdownValidation(content)

  // Проверяем валидность контента
  if (!isValid) {
    return (
      <div className="text-muted-foreground italic p-4 border border-destructive/20 rounded-lg bg-destructive/5">
        {error}
      </div>
    )
  }

  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Заголовки
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-primary mb-6 mt-8" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-primary mb-5 mt-7" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-primary mb-4 mt-6" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-semibold text-foreground mb-3 mt-5" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-base font-semibold text-foreground mb-2 mt-4" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-sm font-semibold text-foreground mb-2 mt-3" {...props} />,
          
          // Параграфы
          p: ParagraphComponent,
          
          // Код
          code: CodeComponent,
          pre: PreComponent,
          
          // Изображения
          img: ImageComponent,
          
          // Текстовые элементы
          strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-foreground" {...props} />,
          
          // Цитаты
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />
          ),
          
          // Списки
          ul: ({ node, ...props }) => (
            <ul className="markdown-list mb-4 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="markdown-list-ordered mb-4 space-y-1" {...props} />
          ),
          li: ListItemComponent,
          
          // Таблицы
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-border" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-border" {...props} />,
          th: ({ node, ...props }) => (
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-4 py-2 text-foreground" {...props} />
          ),
          
          // Ссылки
          a: ({ node, ...props }) => (
            <a 
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props} 
            />
          ),
          
          // Горизонтальная линия
          hr: ({ node, ...props }) => <hr className="border-border my-6" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
