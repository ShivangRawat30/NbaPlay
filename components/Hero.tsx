'use client'

import { globalActions } from '@/store/globalSlices'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { FaBasketballBall, FaGamepad } from 'react-icons/fa'

const Hero: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { setCreateModal } = globalActions
  const IMAGE_BANNER = 'https://i.pinimg.com/736x/6d/63/36/6d633636de5a14f5723036ec945e0c6c.jpg'

  return (
    <section className="relative h-screen overflow-hidden">
      <div
        style={{ backgroundImage: `url(${IMAGE_BANNER})` }}
        className="absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Welcome to{' '}
            <span className="text-[#09479E]">NBA</span>
            <span className="text-[#E80E0D]">Play</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-8">
            Flip, Draft, and Dunk Your Way to NBA Glory!
          </p>
          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Take the leap—turn the cards, reveal the icons, and win big in this thrilling basketball adventure!
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#E80E0D] text-white py-3 px-8 rounded-full font-semibold text-lg shadow-lg hover:bg-[#c50c0b] transition duration-300 ease-in-out flex items-center"
              onClick={() => router.push('/createGame')}
            >
              <FaGamepad className="mr-2" />
              Create Game
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/games"
                className="bg-white text-[#09479E] py-3 px-8 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out flex items-center"
              >
                <FaBasketballBall className="mr-2" />
                My Games
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}

export default Hero