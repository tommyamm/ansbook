import { useEffect, useRef } from 'react'

const ConfettiEffect = ({ trigger, onComplete }) => {
  const canvasRef = useRef(null)
  const animationIdRef = useRef(null)
  const confettiIntervalRef = useRef(null)
  const lastFrameTimeRef = useRef(0)
  const confettiPiecesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    
    const isLowEnd = () => {
      if (typeof navigator === 'undefined') return false
      const cores = navigator.hardwareConcurrency || 1
      const memory = navigator.deviceMemory || 4
      return cores <= 2 || memory <= 2
    }

    const isLowPowerDevice = isLowEnd()

    const CONFIG = {
      initialPieces: isLowPowerDevice ? 8 : 20,
      maxPieces: isLowPowerDevice ? 30 : 100,
      fps: isLowPowerDevice ? 30 : 60,
      createInterval: isLowPowerDevice ? 15000 : 10000,
      gravity: isLowPowerDevice ? 0.08 : 0.1,
    }

    const frameInterval = 1000 / CONFIG.fps
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']

    const resizeCanvas = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      canvas.width = width
      canvas.height = height
      
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (dpr > 1) {
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
      }
    }

    resizeCanvas()
    const resizeListener = () => resizeCanvas()
    window.addEventListener('resize', resizeListener)

    class ConfettiPiece {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = -10
        this.vx = (Math.random() - 0.5) * 3
        this.vy = Math.random() * 2 + 1.5
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.size = Math.random() * 6 + 3
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.15
        this.life = 1
        this.decay = Math.random() * 0.015 + 0.008
        this.isSquare = Math.random() > 0.5
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.rotation += this.rotationSpeed
        this.vy += CONFIG.gravity
        this.life -= this.decay

        if (Math.random() > 0.95) {
          this.vx += (Math.random() - 0.5) * 0.05
        }
      }

      draw() {
        if (this.life <= 0) return

        ctx.save()
        ctx.globalAlpha = this.life
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.fillStyle = this.color

        if (this.isSquare) {
          const half = this.size / 2
          ctx.fillRect(-half, -half, this.size, this.size)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      isDead() {
        return this.life <= 0 || this.y > canvas.height + 50
      }
    }

    const createConfetti = () => {
      if (confettiPiecesRef.current.length > CONFIG.maxPieces) return

      const count = isLowPowerDevice ? 6 : 15
      for (let i = 0; i < count; i++) {
        confettiPiecesRef.current.push(new ConfettiPiece())
      }
    }

    const animate = (currentTime) => {
      if (currentTime - lastFrameTimeRef.current < frameInterval) {
        animationIdRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = confettiPiecesRef.current.length - 1; i >= 0; i--) {
        const piece = confettiPiecesRef.current[i]
        piece.update()
        piece.draw()

        if (piece.isDead()) {
          confettiPiecesRef.current.splice(i, 1)
        }
      }

      if (confettiPiecesRef.current.length === 0 && !trigger) {
        onComplete?.()
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    if (trigger) {
      confettiPiecesRef.current = [] // Clear any existing confetti
      createConfetti() // Initial burst
      confettiIntervalRef.current = setInterval(createConfetti, CONFIG.createInterval)
      animationIdRef.current = requestAnimationFrame(animate)
    } else {
      // Stop any ongoing animation and clear confetti when trigger is false
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
      confettiPiecesRef.current = []
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return () => {
      window.removeEventListener('resize', resizeListener)
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
    }
  }, [trigger, onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  )
}

export default ConfettiEffect