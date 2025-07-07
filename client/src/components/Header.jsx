import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const {userData}=useContext(AppContext);
  return (
    <div className='w-full flex flex-col items-center mt-20 px-4 text-center text-gray-800 gap-4'>
      <img
        src={assets.header_img}
        alt="User avatar or logo"
        className='w-36 h-36 rounded-full mb-6 hover:animate-pulse'
      />

      <h1 className='flex gap-3 text-xl sm:text-3xl items-center'>
        <img
          src={assets.hand_wave}
          alt="Waving hand"
          className='w-8 aspect-square animate-bounce'
        />
        Hey {userData.name?userData.name:'Developer'}!
      </h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
        Welcome to my App
      </h2>

      <p className='mb-8 max-w-md'>
        This is an authentication project built with the MERN stack. It includes modern web features like registration, login, logout, password reset, and email verification.
      </p>

      <button
        className='cursor-pointer hover:shadow-md hover:shadow-pink-500/50
        border px-4 py-2 rounded-full border-gray-800
        hover:text-pink-300 hover:border-pink-400 font-semibold transition-all'
      >
        Get Started
      </button>
    </div>
  );
};

export default Header;
