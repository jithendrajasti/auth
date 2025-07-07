import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import {useNavigate} from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const Login  = () => {
  const navigate = useNavigate();
  const {backendUrl,isLoggedin,setIsLoggedin,getUserData}=useContext(AppContext);
  const [state,setState]=useState(isLoggedin?'Sign up':'Login');
  const [name,setName]=useState('');
  const [emailId,setEmailId]=useState('');
  const [password,setPassword]=useState('');

  const onSubmitHandler=async(e)=>{
    try{
       e.preventDefault();
       axios.defaults.withCredentials=true;
       if(state==='Sign up'){
          const {data}= await axios.post(backendUrl+'/api/auth/register',{
            name,emailId,password
           }) 
           if(data.success){
               setIsLoggedin(true);
               getUserData();
               navigate('/');
           }else{
             toast.error(data.message);
           }
       }else{
           const {data}= await axios.post(backendUrl+'/api/auth/login',{
            emailId,password
           }) 
           if(data.success){
               setIsLoggedin(true);
               getUserData();
               navigate('/');
           }else{
             toast.error(data.message);
           }
       }
    }catch(error){
        toast.error(error.message);
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-pink-400'>
      <img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' onClick={()=>navigate('/')}/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm flex flex-col items-center gap-4'>
        <h2 className='text-3xl font-semibold text-white text-center'>{(state==='Sign up')?'create account':'Login'}</h2>
        <p>
          {(state==='Sign up')?'create your account':'login to your account'}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state==='Sign up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} alt="" className='w-4'/>
            <input onChange={e=>setName(e.target.value.trim())} value={name} type='text' placeholder='Full Name' required className='bg-transparent outline-none'/>
          </div>
          )}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-4'/>
            <input onChange={e=>setEmailId(e.target.value.trim())} value={emailId} type='email' placeholder='Email Id' required className='bg-transparent outline-none'/>
          </div>
           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3'/>
            <input onChange={e=>setPassword(e.target.value)} value={password} type='password' placeholder='Password' required className='bg-transparent outline-none'/>
          </div>
          {state==='Login' && (
            <p className='mb-4 text-indigo-600 cursor-pointer hover:underline' onClick={()=>navigate('/reset-password')}>
            forgot password?
            </p>
          )}
          <input type='submit' className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium' value={state}/>
        </form>
        {state==='Sign up' ?(
          <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
          <span className='text-blue-400 cursor-pointer underline' onClick={()=>setState('Login')}>Login here</span>
        </p>
        ):(
          <p className='text-gray-400 text-center text-xs mt-4'>Don't have have an account?{' '}
          <span className='text-blue-400 cursor-pointer underline' onClick={()=>setState('Sign up')}>Sign Up</span>
        </p>
        )}
        
        
      </div>
    </div>
  )
}

export default Login 