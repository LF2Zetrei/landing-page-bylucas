import { useId } from "react";

function pseudoRand(seed) {
    const x = Math.sin(seed*12.9898) *  43758.5453;
    return Math.abs(x - Math.floor(x)) * 2 - 1;
}

export default function ParallelogramsSketch({
    width = '100%',
    height = '100%',
    angle = 15,
    strokeColor = '#111',
    strokeWidth = 2.2,
    fill = 'none',
    strokeCount = 2,
    angleVariation = 1,
    offsetVariation = 4,
    strokes = undefined,
    contentPosition = 'above',
    children
}) {
    const id = useId();
    const viewW = 400;
    const viewH = 200;
    const skew = Math.tan((angle * Math.PI)/ 180) * viewH;

    // Points du parallélogramme (angle appliqué en haut, décalé vers la droite)
    const p1 = { x: skew, y: 0 };
    const p2 = { x: viewW, y: 0 };
    const p3 = { x: viewW - skew, y: viewH };
    const p4 = { x: 0, y: viewH };

    const points = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;

    // Version en fractions (0 à 1) pour le clip-path appliqué au <div> content
    const fp1 = { x: p1.x / viewW, y: p1.y / viewH };
    const fp2 = { x: p2.x / viewW, y: p2.y / viewH };
    const fp3 = { x: p3.x / viewW, y: p3.y / viewH };
    const fp4 = { x: p4.x / viewW, y: p4.y / viewH };
    const fractionalPoints = `${fp1.x},${fp1.y} ${fp2.x},${fp2.y} ${fp3.x},${fp3.y} ${fp4.x},${fp4.y}`;

    // Traits supplémentaires : manuels si fournis, sinon générés automatiquement
    const extraStrokes =
        strokes ??
        Array.from({ length: Math.max(0, strokeCount - 1) }, (_, i) => ({
        rotation: pseudoRand(i + 1) * angleVariation,
        offsetX: pseudoRand(i + 51) * offsetVariation,
        offsetY: pseudoRand(i + 101) * offsetVariation,
        opacity: Math.max(0.2, 0.55 - i * 0.08),
        strokeWidth: strokeWidth * 0.65,
        }));
    
    const svg = (
        <svg
            viewBox={`0 0 ${viewW} ${viewH}`}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            style={{ display: 'block', overflow: 'visible', position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
        <clipPath id={`clip-${id}`} clipPathUnits="objectBoundingBox">
            <polygon points={fractionalPoints} />
        </clipPath>
    
        <polygon
            points={points}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
        />
        {extraStrokes.map((s, i) => (
            <polygon
            key={i}
            points={points}
            fill="none"
            stroke={s.color ?? strokeColor}
            strokeWidth={s.strokeWidth ?? strokeWidth * 0.65}
            strokeLinejoin="round"
            opacity={s.opacity ?? 0.4}
            transform={`translate(${s.offsetX ?? 0}, ${s.offsetY ?? 0}) rotate(${s.rotation ?? 0} ${viewW / 2} ${viewH / 2})`}
            />
        ))}
        </svg>
    );

    const content = children && (
        <div
            style={{
            position: 'absolute',
            inset: 0,
            clipPath: `url(#clip-${id})`,
            }}
        >
            {children}
        </div>
    );

    return (
        <div style={{ width, height, position: 'relative' }}>
        {contentPosition === 'below' ? (
            <>
            {content}
            {svg}
            </>
        ) : (
            <>
            {svg}
            {content}
            </>
        )}
        </div>
    );

}