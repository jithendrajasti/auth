import React, { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from '../context/AppContext'

const ResetPass = () => {
  const navigate = useNavigate()
  const {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    getUserData,
    getAuthstate,
    setUserData,
    userData,
  } = useContext(AppContext)

  axios.defaults.withCredentials = true

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const inputRefs = useRef([])
  const [otp, setOtp] = useState('')

  const moveNext = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const moveBack = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6)
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const firstHandler = async (e) => {
    e.preventDefault()
    try {
      const trimmedEmail = email.trim()
      const { data } = await axios.post(backendUrl + '/api/auth/resetPass', { emailId: trimmedEmail })
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleResetPass = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    const otp = otpArray.join('');
    if (otp.length !== inputRefs.current.length) {
      return toast.error("Please enter the full OTP.");
    }
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verifyResetPass', {
        emailId: email.trim(),
        otp: otp,
        newpassword: pass
      })
      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEmailSent && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [isEmailSent])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-pink-400'>
      <img
        src={assets.logo}
        alt=''
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
        onClick={() => navigate('/')}
      />

      {!isEmailSent ? (
        <form onSubmit={firstHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center text-indigo-300 mb-6'>Enter your registered email Id</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='' className='w-4' />
            <input
              type='email'
              placeholder='Email Id'
              required
              className='bg-transparent outline-none text-indigo-300'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <input
            type='submit'
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
            value='GET OTP'
          />
        </form>
      ) : (
        <form onSubmit={handleResetPass} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center text-indigo-300 mb-6'>Enter 6-digit code sent to your Email</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type='text'
                  maxLength='1'
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => moveNext(e, index)}
                  onKeyDown={(e) => moveBack(e, index)}
                  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                />
              ))}
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='' className='w-3' />
            <input
              type='password'
              placeholder='New password'
              required
              className='bg-transparent outline-none text-indigo-300'
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <input
            type='submit'
            value='Reset password'
            className='w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium rounded-full cursor-pointer'
          />
        </form>
      )}
    </div>
  )
}

export default ResetPass
