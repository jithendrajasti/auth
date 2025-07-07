import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, isLoggedin,backendUrl,setUserData,setIsLoggedin } = useContext(AppContext);
  const logout=async()=>{
    try{
        axios.defaults.withCredentials=true;
        const {data}=await axios.post(backendUrl+'/api/auth/logout');
        data.success && setIsLoggedin(false);
        data.success && setUserData({});
        navigate('/');
    }catch(error){
      toast.error(error.message);
    }
  }

  const sendVerificationOtp=async()=>{
    try{
       axios.defaults.withCredentials=true;
       const {data}=await axios.post(backendUrl+'/api/auth/sendVerifyOtp');
       if(data.success){
        navigate('/email-verify');
        toast.success(data.message);
       }
    }catch(error){
      toast.error(error.message);
    }
  }
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50'>
      <img src={assets.logo} alt="Logo" className='w-28 sm:w-32' />

      {isLoggedin && userData?.name ? (
        <div className='w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium shadow relative group top-1'>
          {userData.name.charAt(0).toUpperCase()}
          <div className='w-[115px] absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded-full pt-10 transition-all'>
                 <ul className='list-none m-0 p-2 bg-gray-100 text-sm flex flex-col items-start'>
                  {!userData.isVerified && (<li onClick={sendVerificationOtp} className=' hover:bg-gray-200 cursor-pointer w-full py-1 pl-2 hover:rounded-sm'>Verify email</li>)}
                  <li onClick={logout} className='hover:bg-gray-200 cursor-pointer w-full py-1 pl-2 hover:rounded-sm'>Logout</li>
                 </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center justify-center gap-2 border border-gray-500 px-3 py-1 rounded-full text-gray-800 hover:text-blue-700 hover:font-semibold hover:border-blue-500 transition-all hover:shadow-md hover:shadow-blue-400/40 relative top-1'
        >
          Login
          <img src={assets.arrow_icon} className='animate-pulse w-4 h-4' alt="arrow" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
