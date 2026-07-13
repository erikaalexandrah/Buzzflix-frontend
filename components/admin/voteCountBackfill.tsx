'use client';

import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useUserData } from '@/context/userContext';
import {
  BackfillError,
  VoteCountBackfillResponse,
  VoteCountStatus,
  backfillVoteCounts,
  getVoteCountBackfillStatus,
} from '@/config/api';

const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 500;

const VoteCountBackfill: React.FC = () => {
  const { isAdmin, handleLogout } = useUserData();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [status, setStatus] = useState<VoteCountStatus | null>(null);
  const [lastBatch, setLastBatch] = useState<VoteCountBackfillResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  if (!isAdmin || hidden) return null;

  const handleError = (caught: unknown) => {
    if (axios.isCancel(caught) || (caught instanceof DOMException && caught.name === 'AbortError')) return;
    if (caught instanceof BackfillError) {
      if (caught.status === 401) {
        handleLogout();
        window.location.href = '/login';
        return;
      }
      if (caught.status === 403) {
        setHidden(true);
        setOpen(false);
        return;
      }
      setError(caught.message);
      return;
    }
    setError('Error de red al actualizar las votaciones');
  };

  const openPanel = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const token = localStorage.getItem('jwt');
      setStatus(await getVoteCountBackfillStatus(token, controller.signal));
    } catch (caught) {
      handleError(caught);
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      setLoading(false);
    }
  };

  const runBatch = async () => {
    if (loading || status?.complete) return;
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const token = localStorage.getItem('jwt');
      const result = await backfillVoteCounts(token, BATCH_SIZE, controller.signal);
      setLastBatch(result);
      setStatus(result);
    } catch (caught) {
      handleError(caught);
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      setLoading(false);
    }
  };

  const completeBackfill = async () => {
    if (loading || status?.complete) return;
    setLoading(true);
    setCompleting(true);
    setError(null);
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const token = localStorage.getItem('jwt');
      let complete = false;

      while (!complete && !controller.signal.aborted) {
        const result = await backfillVoteCounts(token, BATCH_SIZE, controller.signal);
        setLastBatch(result);
        setStatus(result);
        complete = result.complete;

        if (!complete) {
          await new Promise<void>((resolve, reject) => {
            const timeout = window.setTimeout(resolve, BATCH_DELAY_MS);
            controller.signal.addEventListener('abort', () => {
              window.clearTimeout(timeout);
              reject(new DOMException('Cancelado', 'AbortError'));
            }, { once: true });
          });
        }
      }
    } catch (caught) {
      handleError(caught);
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      setCompleting(false);
      setLoading(false);
    }
  };

  const cancel = () => controllerRef.current?.abort();

  const closePanel = () => {
    cancel();
    setOpen(false);
  };

  return (
    <>
      <button onClick={openPanel} className="b-btn bg-electric text-sm text-paper">
        Votos TMDB
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/80 p-0 sm:items-center sm:p-5" onClick={closePanel}>
          <section
            className="w-full max-w-xl border-x-2 border-t-2 border-ink bg-paper p-5 shadow-brutal-lg sm:border-2 sm:p-7"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vote-count-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="b-tag bg-electric text-paper">Administración</span>
                <h2 id="vote-count-title" className="b-display mt-3 text-3xl sm:text-4xl">Datos de votación TMDB</h2>
              </div>
              <button onClick={closePanel} className="b-border h-10 w-10 shrink-0 bg-coral text-xl font-bold text-paper" aria-label="Cerrar">×</button>
            </div>

            {status ? (
              <div className="mt-6">
                <p className="text-lg font-extrabold">{status.completed} / {status.total} películas actualizadas</p>
                <div className="mt-3 h-5 overflow-hidden border-2 border-ink bg-paper" aria-label={`Progreso: ${status.percentage}%`}>
                  <div className="h-full bg-buzz transition-[width]" style={{ width: `${Math.min(status.percentage, 100)}%` }} />
                </div>
                <p className="mt-2 text-sm font-bold uppercase">Progreso: {status.percentage}% · Pendientes: {status.remaining}</p>
              </div>
            ) : (
              <p className="mt-6 text-sm font-bold uppercase">{loading ? 'Consultando progreso…' : 'No se pudo consultar el progreso'}</p>
            )}

            {lastBatch && (
              <div className="mt-5 border-2 border-ink bg-buzz/40 p-3 text-sm font-bold">
                Último lote: {lastBatch.updated} actualizadas, {lastBatch.failed} fallidas.
                {lastBatch.failures.length > 0 && (
                  <ul className="mt-2 max-h-28 overflow-y-auto text-xs text-coral">
                    {lastBatch.failures.map((failure) => <li key={failure.id}>ID {failure.id}: {failure.error}</li>)}
                  </ul>
                )}
              </div>
            )}

            {error && <p className="mt-5 border-2 border-ink bg-coral p-3 text-sm font-bold text-paper">{error}</p>}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button onClick={runBatch} disabled={loading || !status || status.complete} className="b-btn bg-buzz disabled:cursor-not-allowed disabled:opacity-50">
                Actualizar siguiente lote
              </button>
              {completing ? (
                <button onClick={cancel} className="b-btn bg-coral text-paper">Cancelar actualización</button>
              ) : (
                <button onClick={completeBackfill} disabled={loading || !status || status.complete} className="b-btn bg-grape text-paper disabled:cursor-not-allowed disabled:opacity-50">
                  Completar actualización
                </button>
              )}
            </div>
            {status?.complete && <p className="mt-5 b-tag bg-buzz">Actualización completada</p>}
          </section>
        </div>
      )}
    </>
  );
};

export default VoteCountBackfill;
