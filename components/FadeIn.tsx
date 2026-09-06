"use client"

import { ReactNode, useEffect, useState } from "react"

export type FadeInProps = {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'  // une direction en plus par rapport à ScrollReveal
  duration?: number
  delay?: number
  distance?: number
  className?: string
}

export const FadeIn = ({
    children,
    direction = 'none',
    duration = 600,
    delay = 0,
    distance = 40,
    className,
}: FadeInProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            setIsVisible(true);
        })
        return () => {
            cancelAnimationFrame(raf)
        }
    }, [])

    const getTransform = () => {
        switch (direction) {
            case 'up':    return `translateY(${distance}px)`
            case 'down':  return `translateY(-${distance}px)`
            case 'left':  return `translateX(${distance}px)`
            case 'right': return `translateX(-${distance}px)`
            case 'none':  return 'none'
        }
    }

    return (
       <div
            className={className}
            style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : getTransform(),
            transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
            transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}