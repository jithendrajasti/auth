import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='w-screen min-h-screen flex flex-col items-center justify-center bg-[url("/bg_img.png")]'>
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home