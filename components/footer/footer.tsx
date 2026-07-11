import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-ink bg-ink text-paper">
      {/* Tira marquee */}
      <div className="overflow-hidden border-b-2 border-paper/30 bg-buzz py-2">
        <div className="b-marquee flex w-max whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center font-display text-sm uppercase tracking-tight text-ink">
              {Array.from({ length: 8 }).map((__, j) => (
                <span key={j} className="mx-4 flex items-center gap-4">
                  Trailers sin spoilers <span className="text-grape">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Marca */}
          <div className="max-w-sm">
            <span className="b-border inline-block bg-buzz px-3 py-1.5 font-display text-xl uppercase tracking-tight text-ink">
              Buzzflix
            </span>
            <p className="mt-4 text-sm font-medium leading-relaxed text-paper/70">
              Descubre trailers, explora estrenos y encuentra tu próxima
              película. Sin spoilers, sin relleno.
            </p>
          </div>

          {/* Links */}
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm font-bold uppercase tracking-tight">
            <a href="/" className="w-fit border-b-2 border-transparent hover:border-buzz hover:text-buzz">Inicio</a>
            <a href="/search" className="w-fit border-b-2 border-transparent hover:border-buzz hover:text-buzz">Explorar</a>
            <a href="/favorite" className="w-fit border-b-2 border-transparent hover:border-buzz hover:text-buzz">Favoritos</a>
            <a href="/login" className="w-fit border-b-2 border-transparent hover:border-buzz hover:text-buzz">Entrar</a>
          </nav>

          {/* Social */}
          <div className="flex gap-3">
            {[
              { label: 'Twitter', href: 'https://twitter.com', path: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
              { label: 'YouTube', href: 'https://youtube.com', path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' },
              { label: 'Facebook', href: 'https://facebook.com', path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="b-border flex h-10 w-10 items-center justify-center bg-paper text-ink shadow-brutal-white transition hover:bg-buzz hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t-2 border-paper/20 pt-6 text-xs font-medium text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} BuzzFlix. Todos los derechos reservados.</p>
          <p>Desarrollado por Erika Hernández y Kevin Hernández.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
