import Link from 'next/link'
import React from 'react'
import ConnectBtn from './ConnectBtn'
import Logo from '../public/logo.png'; // Import the logo image

const Header: React.FC = () => {
  return (
    <header className="shadow-sm shadow-blue-900 py-4 text-blue-700">
      <main className="lg:w-[85%] pl-5 w-full mx-auto flex justify-between items-center flex-wrap">
        <Link href="/">
          <img src={Logo.src} alt="NBA Play Logo" className="w-20 h-20" />
        </Link>

        <div className="flex justify-end items-center text-white space-x-2 md:space-x-4 mt-2 md:mt-0">
          <Link href={'/games'} className="text-md">
            My Games
          </Link>

          <ConnectBtn />
        </div>
      </main>
    </header>
  )
}

export default Header
