import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { InlineMath, BlockMath } from 'react-katex'

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

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