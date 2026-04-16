import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Анимированный аккордеон через реальную высоту элемента
export function AnimatedCollapse({ isOpen, children }) {
    const ref = useRef(null)
    const [height, setHeight] = useState(isOpen ? 'auto' : '0px')
    const [overflow, setOverflow] = useState(isOpen ? 'visible' : 'hidden')

    useLayoutEffect(() => {
        if (!ref.current) return
        if (isOpen) {
            const h = ref.current.scrollHeight
            setHeight(`${h}px`)
            setOverflow('hidden')
            const t = setTimeout(() => setHeight('auto'), 250)
            return () => clearTimeout(t)
        } else {
            // Сначала фиксируем текущую высоту, потом анимируем к 0
            const h = ref.current.scrollHeight
            setHeight(`${h}px`)
            setOverflow('hidden')
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setHeight('0px'))
            })
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) return
        const t = setTimeout(() => setOverflow('hidden'), 250)
        return () => clearTimeout(t)
    }, [isOpen])

    return (
        <div
            ref={ref}
            style={{
                height,
                overflow,
                transition: 'height 250ms ease',
            }}
        >
            {children}
        </div>
    )
}