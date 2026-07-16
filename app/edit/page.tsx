'use client';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar';
import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/config/api';
import { genres, countries } from '@/config/data';

type Status = 'loading' | 'ready' | 'error';

const EditProfile = () => {
  const router = useRouter();

  const [status, setStatus] = useState<Status>('loading');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState<string>('');
  const [country, setCountry] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  // El back aún no expone endpoint para persistir cambios de perfil.
  const [notice, setNotice] = useState<string | null>(null);

  const inputClass =
    'b-border mb-4 w-full bg-paper px-4 py-3 text-base font-medium placeholder-ink/30 focus:bg-buzz focus:outline-none';

  useEffect(() => {
    const controller = new AbortController();
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

    if (!token) {
      router.replace('/login');
      return;
    }

    getUserProfile(token, controller.signal)
      .then((profile) => {
        if (controller.signal.aborted) return;
        setUsername(profile.username ?? '');
        setAge(profile.age != null ? String(profile.age) : '');
        setCountry(profile.country ?? '');
        setFavoriteGenre(profile.favoriteGenre ?? '');
        setStatus('ready');
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (error?.response?.status === 401) {
          localStorage.removeItem('jwt');
          router.replace('/login');
          return;
        }
        setStatus('error');
      });

    return () => controller.abort();
  }, [router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: cuando el back exponga PATCH /auth/me (o similar), llamar aquí.
    setNotice('El guardado de perfil aún no está disponible en el servidor.');
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left Side - Info Section */}
        <div className="flex w-full flex-col justify-center border-b-2 border-ink bg-electric px-6 py-12 text-paper md:w-1/2 md:border-b-0 md:border-r-2 md:p-16">
          <a href="/" className="b-border mb-8 w-fit bg-buzz px-3 py-1.5 font-display text-xl uppercase tracking-tight text-ink shadow-brutal">
            Buzzflix
          </a>
          <h2 className="b-display text-5xl md:text-7xl">Tu<br />perfil</h2>
          <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-paper/90 md:text-lg">
            Personaliza tu experiencia. Usamos esta información para darte mejores recomendaciones
            de trailers y nunca la compartimos con terceros.
          </p>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex w-full items-center justify-center bg-paper px-6 py-12 md:w-1/2 md:p-16">
          <div className="b-card w-full max-w-md bg-paper p-7 md:p-9">
            <h1 className="b-display mb-7 text-3xl md:text-4xl">Tus datos</h1>

            {status === 'loading' && (
              <div className="flex justify-center py-16">
                <div className="h-12 w-12 animate-spin border-4 border-ink border-t-buzz" />
              </div>
            )}

            {status === 'error' && (
              <div className="b-card bg-coral p-4 text-center font-bold uppercase text-paper">
                No pudimos cargar tu perfil. Intenta de nuevo.
              </div>
            )}

            {status === 'ready' && (
              <form onSubmit={handleSubmit}>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/60">
                  Email
                </label>
                <input
                  type="email"
                  value={username}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-60`}
                />

                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/60">
                  Edad
                </label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Edad"
                  className={inputClass}
                />

                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/60">
                  País
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Selecciona tu país
                  </option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/60">
                  Género favorito
                </label>
                <select
                  value={favoriteGenre}
                  onChange={(e) => setFavoriteGenre(e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Selecciona tu género favorito
                  </option>
                  {genres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>

                {notice && (
                  <div className="b-border mb-4 bg-buzz px-4 py-3 text-sm font-bold text-ink">
                    {notice}
                  </div>
                )}

                <button type="submit" className="b-btn w-full bg-buzz text-base">
                  Guardar cambios
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
