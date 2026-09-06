import { ReactNode } from 'react';

type GridBackgroundProps = {
  children?: ReactNode;
  bgColor?: string;      // couleur de fond
  lineColor?: string;    // couleur des lignes de la grille
  spacing?: number;      // espace entre les lignes, en px
  lineOpacity?: number;  // opacité des lignes de la grille uniquement (le fond reste plein)
};

// Fond "grille" façon dashboard/circuit imprimé — en CSS pur, statique,
// même structure que MetaballBackground pour rester cohérent avec les
// autres panneaux.
export default function GridBackground({
  children = null,
  bgColor = '#ede8e5',
  lineColor = 'rgba(0, 0, 0, 0.08)',
  spacing = 36,
  lineOpacity = 1,
}: GridBackgroundProps) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
          opacity: lineOpacity,
        }}
      />
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}
