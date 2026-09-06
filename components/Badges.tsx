// components/ui/Badge.tsx
"use client"
import { CSSProperties, ReactNode } from "react"

export type BadgeSize = 'sm' | 'md' | 'lg'

// Éclaircit/assombrit une couleur CSS quelconque (hex, rgb, nom...) en la
// mélangeant avec du transparent — évite de dépendre d'un lib/colors externe.
function withAlpha(color: string, alpha: number): string {
  return `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`
}

// Trois directions visuelles, toutes ancrées dans l'identité CatBut :
// - neon   → tube néon (bordure + glow), le même langage que NeonSigns.
//            Pour les statuts qui doivent "claquer" : en ligne, erreur.
// - ticket → étiquette clippée façon tag, fond translucide doux.
//            Pour les catégories qui se lisent en série (liste de tags
//            sur une commande) sans surcharger l'œil de glow partout.
// - accent → barre latérale, pas de fond. Pour les contextes denses
//            (tables, listes longues) où le glow deviendrait du bruit.
export type BadgeAppearance = 'neon' | 'ticket' | 'accent'

export type BadgeProps = {
  children?: ReactNode
  color: string
  appearance?: BadgeAppearance
  size?: BadgeSize
  // Petit point avant le texte — pulsant visuellement en 'neon',
  // discret dans les deux autres apparences. Pour un statut live
  // ("en ligne") plutôt qu'une catégorie statique ("mod", "!lurk").
  dot?: boolean
  className?: string
  style?: CSSProperties
}

const SIZE_PX: Record<BadgeSize, { padding: string; fontSize: number; borderWidth: number; dot: number }> = {
  sm: { padding: '2px 8px', fontSize: 10.5, borderWidth: 1, dot: 5 },
  md: { padding: '3px 10px', fontSize: 11.5, borderWidth: 1.5, dot: 6 },
  lg: { padding: '5px 14px', fontSize: 14, borderWidth: 2, dot: 8 },
}

export const Badge = ({
  children,
  color,
  appearance = 'neon',
  size = 'md',
  dot = false,
  className,
  style,
}: BadgeProps) => {
  const { padding, fontSize, borderWidth: bw, dot: dotSize } = SIZE_PX[size]

  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding,
    fontSize,
    fontWeight: 500,
    fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
  }

  const appearanceStyle: CSSProperties =
    appearance === 'neon'
      ? {
          borderRadius: 6,
          borderWidth: bw,
          borderStyle: 'solid',
          borderColor: color,
          background: withAlpha(color, 0.12),
          color,
          boxShadow: `0 0 ${5 * bw}px ${withAlpha(color, 0.4)}, inset 0 0 ${4 * bw}px ${withAlpha(color, 0.12)}`,
          textShadow: `0 0 6px ${withAlpha(color, 0.6)}`,
        }
      : appearance === 'ticket'
      ? {
          padding: `${padding.split(' ')[0]} 11px ${padding.split(' ')[0]} 9px`,
          background: withAlpha(color, 0.16),
          color,
          clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%)',
        }
      : {
          // accent
          padding: `${padding.split(' ')[0]} 10px ${padding.split(' ')[0]} 9px`,
          borderLeft: `2.5px solid ${color}`,
          color,
          background: 'transparent',
        }

  return (
    <span className={className} style={{ ...base, ...appearanceStyle, ...style }}>
      {dot && (
        <span
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: color,
            boxShadow: appearance === 'neon' ? `0 0 4px ${color}` : undefined,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  )
}
