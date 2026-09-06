import { ReactNode, useId } from "react"

export type PulseProps = {
    children: ReactNode
    duration?: number   // durée d'un cycle en ms
    scale?: number      // grossissement max (ex: 1.05)
    opacity?: boolean   // pulser sur l'opacité aussi ?
    className?: string
}

export const Pulse = ({ children, duration = 2000, scale = 1.05, opacity = false, className }: PulseProps) => {
    const id = useId()
    const animName = `pulse-${id.replace(/:/g, '')}`
    const midOpacity = opacity ? 'opacity: .55;' : ''

    return (
        <>
        <style>{`
            @keyframes ${animName} {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%       { transform: scale(${scale}); ${midOpacity} }
            }
        `}</style>
        <div
            className={className}
            style={{ animation: `${animName} ${duration}ms ease-in-out infinite` }}
        >
            {children}
        </div>
        </>
    )
}