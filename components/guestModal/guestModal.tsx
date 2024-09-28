'use client'
import { useState, useEffect } from 'react';
import BuzzFlix from '@/svg/buzzflix';

const GuestLoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasSeenModal = sessionStorage.getItem('hasSeenModal');
    if (!hasSeenModal) {
      setIsOpen(true);
      sessionStorage.setItem('hasSeenModal', 'true');
    }
  }, []);

  const closeModal = () => setIsOpen(false);

  const handleGuest = () => {
    closeModal();
    if (isClient) {
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    }
  };

  const handleLogin = () => {
    closeModal();
    if (isClient) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 300);
    }
  };

  if (!isOpen || !isClient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#141414] p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-white">Welcome to</h2>
        <div className='flex flex-row justify-center mb-4'><BuzzFlix/> </div>
        <p className="text-white mb-6">Select an option to continue:</p>
        <button 
          onClick={handleGuest} 
          className="bg-yellow-500 text-white py-3 px-6 rounded mb-4 w-full font-bold hover:bg-yellow-600"
        >
          Continue as Guest
        </button>
        <button 
          onClick={handleLogin} 
          className="bg-gray-800 text-white py-3 px-6 rounded w-full font-bold hover:bg-gray-900"
        >
          Login / Register
        </button>
      </div>
    </div>
  );
};

export default GuestLoginModal;
