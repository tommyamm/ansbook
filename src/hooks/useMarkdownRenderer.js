import { useMemo } from 'react'

// Хук для оптимизации markdown рендеринга
export const useMarkdownRenderer = (content) => {
  const processedContent = useMemo(() => {
    if (!content || typeof content !== 'string') {
      return ''
    }

    // Предварительная обработка контента для стабильности
    return content
      // Убираем потенциально проблемные символы
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Нормализуем переносы строк
      .replace(/\n{3,}/g, '\n\n')
      // Убираем лишние пробелы в начале и конце
      .trim()
  }, [content])

  return processedContent
}

// Хук для проверки валидности markdown контента
export const useMarkdownValidation = (content) => {
  return useMemo(() => {
    if (!content || typeof content !== 'string') {
      return { isValid: false, error: 'Контент отсутствует или имеет неверный формат' }
    }

    // Проверяем на потенциально проблемные паттерны
    const problematicPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ]

    for (const pattern of problematicPatterns) {
      if (pattern.test(content)) {
        return { 
          isValid: false, 
          error: 'Обнаружен потенциально опасный контент' 
        }
      }
    }

    return { isValid: true, error: null }
  }, [content])
}
