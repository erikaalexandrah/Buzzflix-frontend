'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import buzzflix from '../public/buzzflix.png';
import buzzAvatar from '../public/buzz.png';
import { useUserData } from '../context/userContext';

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser, isUserLoading, handleLogout } = useUserData();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleNavMenu = () => {
    setIsNavMenuOpen(!isNavMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
    }
  };

  if (isUserLoading) {
    return <div className="navbar bg-black text-white">Loading...</div>;
  }

  return (
    <div className="navbar bg-black text-white">
      {/* Navbar Start */}
      <div className="flex items-center">
        {/* Dropdown menu for sm and md */}
        <div className="dropdown lg:hidden ml-4">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden"
            onClick={toggleNavMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          {isNavMenuOpen && (
            <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black rounded-box w-52">
              <li><a href="/">Home</a></li>
              <li><a href="#">Movies</a></li>
              <li><a href="#">Popular News</a></li>
              {currentUser && <li><a href="/favorite">My List</a></li>}
            </ul>
          )}
        </div>

        {/* Logo */}
        <a href="/" className="flex items-center">
          <Image src={buzzflix} alt="Buzzflix logo" className="h-8 w-auto ml-4" />
        </a>

        <ul className="hidden lg:flex ml-8 space-x-6">
          <li><a className="hover:text-gray-400" href="#">Popular Movies</a></li>
          {currentUser && <li><a className="hover:text-gray-400" href="/favorite">My List</a></li>}
        </ul>
      </div>
      {/* Navbar End */}
      <div className="flex items-center gap-4 ml-auto mr-6">
        {/* Search */}
        <div className="relative">
          {isSearchOpen || window.innerWidth >= 768 ? (
            <input
              type="text"
              placeholder="Search movies"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
              className="input input-bordered w-full max-w-xs bg-[#141414] text-white placeholder-gray-500"
            />
          ) : (
            <button onClick={toggleSearch} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
        
                {/* Profile or Sign In */}
        <div className="dropdown dropdown-end">
          {currentUser ? (
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-circle avatar"
              onClick={toggleProfileMenu}
            >
              <div className="w-8 rounded-full">
                <Image
                  alt="User avatar"
                  src={buzzAvatar}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            </div>
          ) : (
            <a href="/login" className="btn bg-yellow-500 text-black">
              Sign In
            </a>
          )}
          {isProfileMenuOpen && currentUser && (
            <ul
              className="menu menu-sm dropdown-content bg-black text-white rounded-box z-[1] mt-3 w-48 p-2 shadow"
            >
              <li>
                <a className="justify-between" href="/edit">
                  Profile
                </a>
              </li>
              <li><a>Settings</a></li>
              <li>
              <button 
                  onClick={() => { 
                    handleLogout(); 
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left"
                >
                  Log Out
                </button>
              </li>
            </ul>
          )}
        </div>
        </div>
    </div>
  );
};

export default Navbar;
