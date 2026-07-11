import React from 'react';

/** Placeholder brutalista del hero mientras carga la película destacada. */
const HeroSkeleton: React.FC = () => (
  <section className="border-b-2 border-ink bg-paper">
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-4 flex items-center gap-3">
        <span className="b-blink h-6 w-28 border-2 border-ink bg-coral" />
        <span className="b-blink h-6 w-28 border-2 border-ink bg-buzz" style={{ animationDelay: '120ms' }} />
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Caja del trailer */}
        <div className="relative aspect-video w-full overflow-hidden border-2 border-ink bg-ink/10 shadow-brutal">
          <div className="b-skeleton absolute inset-0 opacity-20" />
          <span className="b-border absolute bottom-3 right-3 h-11 w-11 bg-buzz shadow-brutal-sm" />
        </div>

        {/* Bloque de info */}
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <span className="b-blink block h-10 w-4/5 bg-ink/20" />
            <span className="b-blink block h-10 w-3/5 bg-ink/20" style={{ animationDelay: '80ms' }} />
            <div className="space-y-2 pt-3">
              <span className="b-blink block h-3 w-full bg-ink/15" />
              <span className="b-blink block h-3 w-11/12 bg-ink/15" style={{ animationDelay: '80ms' }} />
              <span className="b-blink block h-3 w-4/6 bg-ink/15" style={{ animationDelay: '160ms' }} />
            </div>
          </div>
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="b-blink h-6 w-16 border-2 border-ink bg-grape" />
              <span className="b-blink h-6 w-20 border-2 border-ink bg-paper" style={{ animationDelay: '100ms' }} />
              <span className="b-blink h-6 w-16 border-2 border-ink bg-electric" style={{ animationDelay: '200ms' }} />
            </div>
            <div className="flex gap-3">
              <span className="b-border h-11 w-36 bg-buzz shadow-brutal" />
              <span className="b-border h-11 w-28 bg-paper shadow-brutal" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSkeleton;
