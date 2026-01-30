'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function RevealOnScroll({
  children,
  delay = 0,
  className = '',
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
