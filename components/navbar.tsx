'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import buzzflix from '../public/buzzflix.png';
import buzzAvatar from '../public/buzz.png';
import { useUserData } from '../context/userContext';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '#' },
  { label: 'Popular', href: '#' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { currentUser, isUserLoading, handleLogout } = useUserData();

  // Fondo sólido al hacer scroll (efecto Netflix)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Focus al abrir el buscador
  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  // Cerrar menú de perfil al hacer click fuera
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const submitSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#0b0b0b]/90 backdrop-blur-md'
          : 'border-b border-transparent bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-[1400px] items-center px-4 sm:px-8">
        {/* ---- Izquierda: logo + links ---- */}
        <div className="flex items-center gap-8">
          {/* Toggle mobile */}
          <button
            onClick={() => setIsMobileOpen((v) => !v)}
            className="text-white/90 transition hover:text-white lg:hidden"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          {/* Logo */}
          <a href="/" className="flex shrink-0 items-center">
            <Image src={buzzflix} alt="Buzzflix" className="h-7 w-auto" priority />
          </a>

          {/* Links desktop */}
          <ul className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-light tracking-wide text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {currentUser && (
              <li>
                <a
                  href="/favorite"
                  className="text-sm font-light tracking-wide text-white/70 transition-colors hover:text-white"
                >
                  My List
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* ---- Derecha: búsqueda + perfil ---- */}
        <div className="ml-auto flex items-center gap-4">
          {/* Búsqueda expandible */}
          <div className="flex items-center">
            <div
              className={`flex items-center overflow-hidden border-b transition-all duration-300 ${
                isSearchOpen
                  ? 'w-44 border-white/40 sm:w-56'
                  : 'w-0 border-transparent'
              }`}
            >
              <input
                ref={searchRef}
                type="text"
                placeholder="Buscar trailers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={submitSearch}
                className="w-full bg-transparent px-2 py-1 text-sm text-white placeholder-white/40 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setIsSearchOpen((v) => !v)}
              className="p-1.5 text-white/80 transition hover:text-white"
              aria-label="Buscar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth="1.8" d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Perfil o Sign In */}
          {isUserLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
          ) : currentUser ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen((v) => !v)}
                className="flex items-center gap-1.5 outline-none"
              >
                <div className="h-8 w-8 overflow-hidden rounded-md ring-1 ring-white/20 transition hover:ring-white/50">
                  <Image alt="avatar" src={buzzAvatar} width={32} height={32} />
                </div>
                <svg
                  className={`h-3.5 w-3.5 text-white/70 transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeWidth="2" d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isProfileOpen && (
                <ul className="absolute right-0 mt-3 w-44 overflow-hidden rounded-md border border-white/10 bg-black/95 py-1 shadow-xl backdrop-blur-sm">
                  <li>
                    <a href="/edit" className="block px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
                      Perfil
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
                      Ajustes
                    </a>
                  </li>
                  <li className="my-1 border-t border-white/10" />
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="rounded bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/80"
            >
              Iniciar sesión
            </a>
          )}
        </div>
      </nav>

      {/* ---- Menú mobile desplegable ---- */}
      {isMobileOpen && (
        <ul className="flex flex-col gap-1 border-t border-white/10 bg-black/95 px-6 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="block py-2 text-sm font-light text-white/80 transition hover:text-white"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          {currentUser && (
            <li>
              <a
                href="/favorite"
                className="block py-2 text-sm font-light text-white/80 transition hover:text-white"
                onClick={() => setIsMobileOpen(false)}
              >
                My List
              </a>
            </li>
          )}
        </ul>
      )}
    </header>
  );
};

export default Navbar;