'use client';
import React, { useState } from 'react';
import { useUserData } from '@/context/userContext';
import { backfillMovies, BackfillError, BackfillResult } from '@/config/api';

type Toast =
  | { kind: 'success'; result: BackfillResult }
  | { kind: 'error'; message: string }
  | null;

const PAGES = 10;

const BackfillButton: React.FC = () => {
  const { isAdmin, handleLogout } = useUserData();
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false); // se oculta si el backend responde 403
  const [toast, setToast] = useState<Toast>(null);

  // El botón solo existe para admins.
  if (!isAdmin || hidden) return null;

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    setToast(null);

    try {
      const token = localStorage.getItem('jwt');
      const result = await backfillMovies(token, PAGES);
      setToast({ kind: 'success', result });
    } catch (error) {
      if (error instanceof BackfillError) {
        if (error.status === 401) {
          // Token inválido/ausente → a login
          handleLogout();
          window.location.href = '/login';
          return;
        }
        if (error.status === 403) {
          // No es admin realmente → ocultar el botón
          setHidden(true);
          return;
        }
        setToast({ kind: 'error', message: error.message });
      } else {
        setToast({ kind: 'error', message: 'Error de red al importar' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className="b-btn bg-grape text-sm text-paper disabled:cursor-not-allowed disabled:opacity-80"
        aria-label="Importar más películas"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin border-2 border-paper/40 border-t-paper" />
            Importando…
          </>
        ) : (
          <>+ Importar</>
        )}
      </button>

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] w-[min(92vw,360px)]">
          <div
            className={`b-card p-4 ${toast.kind === 'success' ? 'bg-buzz' : 'bg-coral text-paper'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-sm uppercase tracking-tight">
                {toast.kind === 'success' ? 'Importación acelerada ✅' : 'No se pudo importar'}
              </p>
              <button
                onClick={() => setToast(null)}
                className="shrink-0 text-lg font-bold leading-none"
                aria-label="Cerrar aviso"
              >
                ×
              </button>
            </div>

            {toast.kind === 'success' ? (
              <ul className="mt-2 space-y-0.5 text-xs font-bold uppercase tracking-tight">
                <li>Importadas: {toast.result.importedMovies}</li>
                <li>Omitidas: {toast.result.skippedMovies}</li>
                <li>Páginas: {toast.result.processedPages}</li>
                <li>Próxima página: {toast.result.nextPage}</li>
              </ul>
            ) : (
              <p className="mt-2 text-xs font-bold uppercase tracking-tight">{toast.message}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BackfillButton;
