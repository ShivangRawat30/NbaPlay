'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { GiBasketballBall, GiWhistle } from 'react-icons/gi'
import { FaRandom } from 'react-icons/fa'
import { globalActions } from '@/store/globalSlices'
import CreateGame from '@/components/CreateGame'
import pg from '../public/PG.json'
import sg from '../public/SG.json'
import sf from '../public/SF.json'
import pf from '../public/PF.json'
import c from '../public/C.json'
import { sendMoney } from '@/services/blockchain'

const Page = () => {
  const { setCreateModal } = globalActions
  const dispatch = useDispatch()
  const { address } = useAccount()
  const [cards, setCards] = useState({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null,
  })
  const [flipped, setFlipped] = useState(false)
  const [power, setPower] = useState(0)
  const [showPower, setShowPower] = useState(false);
  const [flippedCards, setFlippedCards] = useState({
    PG: false,
    SG: false,
    SF: false,
    PF: false,
    C: false,
  })

  useEffect(() => {
    randomizeTeam()
  }, [])

  const makeNewTeam = async() => {
    await sendMoney()
    randomizeTeam();
    setFlipped(true);
  }

  const randomizeTeam = async() => {
    setCards({
      PG: pg.all_time_best_pg[Math.floor(Math.random() * pg.all_time_best_pg.length)],
      SG: sg.all_time_best_sg[Math.floor(Math.random() * sg.all_time_best_sg.length)],
      SF: sf.all_time_best_sf[Math.floor(Math.random() * sf.all_time_best_sf.length)],
      PF: pf.all_time_best_pf[Math.floor(Math.random() * pf.all_time_best_pf.length)],
      C: c.all_time_best_centers[Math.floor(Math.random() * c.all_time_best_centers.length)],
    })
    setFlipped(false)
    setPower(0)
    setShowPower(false)
    setFlippedCards({
      PG: false,
      SG: false,
      SF: false,
      PF: false,
      C: false,
    })
  }

  const calculatePower = () => {
    if (!address) {
      toast.warning('Connect wallet first!')
      return
    }

    const totalPower = Object.values(cards).reduce((sum, card) => {
      return (
        sum +
        (card?.ppg * 3 || 0) +
        (card?.apg * 2.5 || 0) +
        (card?.rpg * 1.5 || 0) +
        (card?.spg || 0) +
        (card?.championships * 3 || 0) +
        (card?.mvps * 3 || 0)
      )
    }, 0)

    setPower(Math.round(totalPower))
    setShowPower(true)
  }

  const handleCardClick = (position) => {
    setFlipped(true);
  }

  const renderCard = (position, card) => (
    <div className="relative w-full h-[520px] perspective-1000 group" onClick={() => handleCardClick(position)}>
      <div
        className={`w-full h-full transition-all duration-500 preserve-3d ${
          flippedCards[position] ? 'rotate-y-180' : ''
        }`}
      >{
        !flipped ? (
        <div className="absolute w-full h-full backface-hidden border-2 border-yellow-500 rounded-lg shadow-lg flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <GiBasketballBall className="text-6xl text-yellow-500" />
        </div>

        ) : (
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg overflow-hidden">
          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              {card.name}
            </p>
            <div>
            </div>
          </div>
        </div>

        )

      }
      </div>
      <div className="mt-2 text-center">
        <h3 className="text-lg font-semibold text-yellow-500">{position}</h3>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>NbaPlay - Draft Your Dream Team</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-yellow-500 mb-8">
          {flipped ? "Your Dream Team" : "Draft Your Dream Team"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {Object.entries(cards).map(([position, card]) => (
            <div key={position}>{card && renderCard(position, card)}</div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-4 mt-[100px]">
          {showPower && (
            <div className="w-full max-w-md">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-yellow-500">Team Power</span>
                <span className="text-sm font-medium text-yellow-500">{power}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(power / 1000) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {
            flipped ? (

            
          <div className="flex flex-col sm:flex-row mt-[50px] space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button
              onClick={makeNewTeam}
              className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              <FaRandom className="text-xl" />
              <span>Redraft Team</span>
            </button>
            <button
              onClick={calculatePower}
              className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              <GiWhistle className="text-xl" />
              <span>{showPower ? "Recalculate Power" : "Calculate Power"}</span>
            </button>
            <button
              onClick={() => dispatch(setCreateModal('scale-100'))}
              className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              <GiBasketballBall className="text-xl" />
              <span>Create Game</span>
            </button>
          </div>
            ):(
              <div className="flex flex-col sm:flex-row mt-[50px] space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                 <button
              onClick={() => setFlipped(true)}
              className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              <GiBasketballBall className="text-xl" />
              <span>Draft Team</span>
            </button>
                </div>
          )
        }
        </div>

        <CreateGame totalPower={power} setFlipped={setFlipped} />

      </main>
    </div>
  )
}

export default Page