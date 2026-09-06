"use client"
import { useEffect, useState } from "react"
import { Pulse } from "@/components/Pulse"
import { Badge } from "@/components/Badges"

type Phase = "started" | "error" | "restarting"

const FIVE_MINUTES = 10 * 6 * 1000
const TEN_SECONDS = 10 * 1000
const FIFTEEN_SECONDS = 15 * 1000

// Boucle d'état du monitoring : started (vert, pulse lent) → après 10 min →
// error (rouge, pulse arrêté) → après 10s → restarting (orange, pulse rapide)
// → après 15s → retour à started, et ça recommence.
const PHASES: Record<
  Phase,
  { color: string; label: string; duration: number; next: Phase; pulseDuration: number | null }
> = {
  started: { color: "#22c55e", label: "started", duration: FIVE_MINUTES, next: "error", pulseDuration: 3000 },
  error: { color: "#ef4444", label: "error", duration: TEN_SECONDS, next: "restarting", pulseDuration: null },
  restarting: { color: "#f97316", label: "restarting", duration: FIFTEEN_SECONDS, next: "started", pulseDuration: 500 },
}

export function MonitoringStatus() {
  const [phase, setPhase] = useState<Phase>("started")

  useEffect(() => {
    const { duration, next } = PHASES[phase]
    const timer = setTimeout(() => setPhase(next), duration)
    return () => clearTimeout(timer)
  }, [phase])

  const { color, label, pulseDuration } = PHASES[phase]

  const badge = (
    <Badge color={color} appearance="neon" size="lg" dot>
      {label}
    </Badge>
  )

  return pulseDuration ? (
    <Pulse duration={pulseDuration} scale={1.03} opacity>
      {badge}
    </Pulse>
  ) : (
    badge
  )
}
