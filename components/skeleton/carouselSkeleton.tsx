import React from 'react';

/** Una tarjeta placeholder brutalista con borde, sombra y latido. */
const CardSkeleton: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
  <div
    className="flex-shrink-0 border-2 border-ink bg-paper shadow-brutal"
    style={{ width: 'var(--card-w, 190px)' }}
  >
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-ink/10">
      {/* Barrido diagonal animado */}
      <div className="b-skeleton absolute inset-0 opacity-20" style={{ animationDelay: `${delay}ms` }} />
      {/* Chip de rating fantasma */}
      <span className="absolute left-2 top-2 h-5 w-10 border-2 border-ink bg-buzz" />
    </div>
    <div className="flex items-center justify-between gap-2 border-t-2 border-ink px-2.5 py-2.5">
      <span className="h-3 w-2/3 bg-ink/25" />
      <span className="text-xs font-bold text-grape/40">▶</span>
    </div>
  </div>
);

interface CarouselSkeletonProps {
  /** Color de acento del bloque de título (rota entre carruseles). */
  accent?: string;
  /** Ancho del título fantasma en px. */
  titleWidth?: number;
  cards?: number;
}

const CarouselSkeleton: React.FC<CarouselSkeletonProps> = ({
  accent = 'bg-ink',
  titleWidth = 220,
  cards = 7,
}) => {
  return (
    <div
      className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6"
      style={{ ['--card-w' as string]: '190px' }}
    >
      {/* Cabecera */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className={`b-blink flex h-9 items-center px-3 ${accent}`} style={{ width: titleWidth }}>
          <span className="h-3 w-full bg-paper/70" />
        </div>
        <div className="flex gap-2">
          <span className="b-border h-9 w-9 bg-paper shadow-brutal-sm" />
          <span className="b-border h-9 w-9 bg-paper shadow-brutal-sm" />
        </div>
      </div>

      {/* Pista */}
      <div className="flex gap-4 overflow-hidden px-1 py-3">
        {Array.from({ length: cards }).map((_, i) => (
          <CardSkeleton key={i} delay={i * 90} />
        ))}
      </div>
    </div>
  );
};

export default CarouselSkeleton;
