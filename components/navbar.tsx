'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import buzzAvatar from '../public/buzz.png';
import { useUserData } from '../context/userContext';
import BackfillButton from './admin/backfillButton';
import VoteCountBackfill from './admin/voteCountBackfill';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '#' },
  { label: 'Popular', href: '#' },
];

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { currentUser, isUserLoading, handleLogout } = useUserData();

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

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
    <header className="sticky top-0 z-50 w-full border-b-2 border-ink bg-paper">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
        {/* Toggle mobile */}
        <button
          onClick={() => setIsMobileOpen((v) => !v)}
          className="b-border flex h-10 w-10 items-center justify-center bg-buzz shadow-brutal-sm lg:hidden"
          aria-label="Menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeWidth="2.5" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {/* Logo */}
        <a href="/" className="b-border flex shrink-0 items-center bg-ink px-3 py-1.5 shadow-brutal-sm">
          <span className="font-display text-lg uppercase tracking-tight text-buzz">Buzzflix</span>
        </a>

        {/* Links desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="border-2 border-transparent px-3 py-1.5 text-sm font-bold uppercase tracking-tight transition-colors hover:border-ink hover:bg-buzz"
              >
                {link.label}
              </a>
            </li>
          ))}
          {currentUser && (
            <li>
              <a
                href="/favorite"
                className="border-2 border-transparent px-3 py-1.5 text-sm font-bold uppercase tracking-tight transition-colors hover:border-ink hover:bg-grape hover:text-paper"
              >
                My List
              </a>
            </li>
          )}
        </ul>

        {/* Derecha */}
        <div className="ml-auto flex items-center gap-3">
          {/* Importar (solo admin) */}
          <div className="hidden lg:block">
            <div className="flex gap-2">
              <VoteCountBackfill />
              <BackfillButton />
            </div>
          </div>

          {/* Búsqueda */}
          <div className="flex items-center">
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isSearchOpen ? 'w-40 sm:w-56' : 'w-0'
              }`}
            >
              <input
                ref={searchRef}
                type="text"
                placeholder="BUSCAR TRAILERS"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={submitSearch}
                className="b-border w-full bg-paper px-3 py-2 text-sm font-bold uppercase tracking-tight placeholder-ink/40 focus:outline-none focus:bg-buzz"
              />
            </div>
            <button
              onClick={() => setIsSearchOpen((v) => !v)}
              className="b-border ml-2 flex h-10 w-10 items-center justify-center bg-paper shadow-brutal-sm transition hover:bg-buzz"
              aria-label="Buscar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth="2.5" d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Perfil o Sign In */}
          {isUserLoading ? (
            <div className="b-border h-10 w-10 animate-pulse bg-ink/10" />
          ) : currentUser ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen((v) => !v)}
                className="b-border flex h-10 w-10 items-center justify-center overflow-hidden bg-grape shadow-brutal-sm"
              >
                <Image alt="avatar" src={buzzAvatar} width={38} height={38} />
              </button>

              {isProfileOpen && (
                <ul className="b-card absolute right-0 mt-3 w-48 p-0">
                  <li>
                    <a href="/edit" className="block border-b-2 border-ink px-4 py-2.5 text-sm font-bold uppercase transition hover:bg-buzz">
                      Perfil
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block border-b-2 border-ink px-4 py-2.5 text-sm font-bold uppercase transition hover:bg-buzz">
                      Ajustes
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-bold uppercase text-coral transition hover:bg-coral hover:text-paper"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <a href="/login" className="b-btn bg-buzz text-sm">
              Entrar
            </a>
          )}
        </div>
      </nav>

      {/* Menú mobile */}
      {isMobileOpen && (
        <ul className="flex flex-col border-t-2 border-ink bg-paper lg:hidden">
          <li className="border-b-2 border-ink p-3 empty:hidden">
            <div className="flex flex-wrap gap-3">
              <VoteCountBackfill />
              <BackfillButton />
            </div>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="block border-b-2 border-ink px-6 py-3 text-sm font-bold uppercase transition hover:bg-buzz"
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
                className="block border-b-2 border-ink px-6 py-3 text-sm font-bold uppercase transition hover:bg-grape hover:text-paper"
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
