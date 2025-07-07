import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
const EmailVerify = () => {
   axios.defaults.withCredentials=true;
  const {backendUrl,isLoggedin,setIsLoggedin,getUserData,getAuthstate,setUserData,userData}=useContext(AppContext)
  const navigate=useNavigate();
  const inputRefs=useRef([]);
  const moveNext=(e,index)=>{
        if(e.target.value.length>0 && index< inputRefs.current.length-1){
          inputRefs.current[index+1].focus();
        }
  }
  const moveBack=(e,index)=>{
          if(e.key==='Backspace' && e.target.value==='' && index>0){
            inputRefs.current[index-1].focus();
          }
  }
  const handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text');
    const pasteArray =paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;
      }
    })
  }
  const verifyOtp=async(e)=>{
    try{
      e.preventDefault();
      const otpArray=inputRefs.current.map(e=>e.value);
      const otp=otpArray.join('');
      if (otp.length !== inputRefs.current.length) {
      return toast.error("Please enter the full OTP.");
    }
       const {data}=await axios.post(backendUrl+'/api/auth/verifyAccount',{otp});

       if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/');
       }else{
        toast.error(data.message);
       }
    }catch(error){
      toast.error(error.message);
    }
  }
  useEffect(()=>{
    isLoggedin && userData && userData.isVerified && navigate('/')
  },[isLoggedin,userData]);
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-pink-400'>
      <img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={()=>navigate('/')}/>
      <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={(e)=>verifyOtp(e)}>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>
              Verification OTP
            </h1>
            <p className='text-center text-indigo-300 mb-6 '>
              Enter the 6-digit code sent to your email id
            </p>
            <div className='flex justify-between mb-8' onPaste={handlePaste}>
                {
                  Array(6).fill(0).map((_,index)=>{
                    return <input type="text" maxLength={'1'} key={index} ref={e=>inputRefs.current[index]=e} onInput={(e)=>{moveNext(e,index)}} onKeyDown={e=>moveBack(e,index)}
                    className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'/>
                  })
                }
            </div>
            <input type="submit" value='Verify email' className='w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium rounded-full cursor-pointer' />
      </form>
    </div>
  )
}

export default EmailVerify