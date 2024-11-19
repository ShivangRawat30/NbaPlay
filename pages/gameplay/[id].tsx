import { getGame, getPlayers, joinGame, pickWinner } from '@/services/blockchain'
import { GameStruct } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { useDispatch } from 'react-redux'
import { GiBasketballBall, GiWhistle } from 'react-icons/gi'
import { FaRandom } from 'react-icons/fa'
import { globalActions } from '@/store/globalSlices'
import CreateGame from '@/components/CreateGame'
import pg from '../../public/PG.json'
import sg from '../../public/SG.json'
import sf from '../../public/SF.json'
import pf from '../../public/PF.json'
import c from '../../public/C.json'
import { sendMoney } from '@/services/blockchain'

interface PlayerStruct {
  id: number
  gameId: number
  account: string
  power: number
}

interface PageComponents {
  gameData: GameStruct
  playerData: PlayerStruct[]
}

const Page: NextPage<PageComponents> = ({ gameData, playerData }) => {
  const { setCreateModal } = globalActions
  const dispatch = useDispatch()
  const { address } = useAccount()
  console.log(playerData)

  const [isPlayer, setPlayer] = useState(false)
  const [cards, setCards] = useState({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null,
  })
  const [flipped, setFlipped] = useState(false)
  const [power, setPower] = useState(0)
  const [showPower, setShowPower] = useState(false)
  const [flippedCards, setFlippedCards] = useState({
    PG: false,
    SG: false,
    SF: false,
    PF: false,
    C: false,
  })

  useEffect(() => {
    randomizeTeam()
    const checkPlayerStatus = () => {
      if (!address || !playerData) return false
      return playerData.some((player) => player?.account?.toLowerCase() === address?.toLowerCase())
    }
    setPlayer(checkPlayerStatus())
  }, [address, playerData])

  const makeNewTeam = async () => {
    await sendMoney()
    randomizeTeam()
    setFlipped(true)
  }

  const randomizeTeam = async () => {
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

  const getWinner = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        pickWinner(gameData.id)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Game Ended 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const join = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        joinGame(gameData.id, power, gameData.stake)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Game Entered 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleCardClick = (position) => {
    setFlipped(true)
  }

  const renderCard = (position, card) => (
    <div
      className="relative w-full h-[520px] perspective-1000 group"
      onClick={() => handleCardClick(position)}
    >
      <div
        className={`w-full h-full transition-all duration-500 preserve-3d ${
          flippedCards[position] ? 'rotate-y-180' : ''
        }`}
      >
        {!flipped ? (
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
              <div></div>
            </div>
          </div>
        )}
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
        {gameData.paidOut ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-yellow-500 mb-4">The Game Has Ended</h2>
            <p className="text-2xl">
              Winner: <span className="text-green-500">{gameData.winner}</span>
            </p>
          </div>
        ) : (
          <>
            {isPlayer ? (
              <>
                {gameData.winner === address ? (
                  <div className="text-center py-20">
                    <h2 className="text-4xl font-bold text-yellow-500 mb-4">You are the Winner</h2>
                    <p className="text-2xl">
                      Winner: <span className="text-green-500">{gameData.winner}</span>
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-center items-center min-h-screen">
                    <button
                      className="bg-white text-black font-bold py-3 px-6 rounded-full border border-black shadow-lg hover:bg-gray-200 transition duration-300"
                      onClick={getWinner}
                    >
                      Pick Winner
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-center text-yellow-500 mb-8">
                  {flipped ? 'Your Dream Team' : 'Draft Your Dream Team'}
                </h2>

                <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
                  <h3 className="text-2xl font-semibold mb-4 text-yellow-500">Game Info</h3>
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-gray-400">Game ID:</p>
                      <p className="text-xl">{gameData.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Owner:</p>
                      <p className="text-xl truncate">{gameData.owner}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Stake:</p>
                      <p className="text-xl">{gameData.stake} ETH</p>
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-gray-400">Prize:</p>
                      <p className="text-3xl text-green-500 font-bold">{2 * gameData.stake} ETH</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                  {Object.entries(cards).map(([position, card]) => (
                    <div key={position}>{card && renderCard(position, card)}</div>
                  ))}
                </div>

                <div className="flex flex-col items-center space-y-6 mt-12">
                  {showPower && (
                    <div className="w-full max-w-md">
                      <div className="flex justify-between mb-2">
                        <span className="text-lg font-medium text-yellow-500">Team Power</span>
                        <span className="text-lg font-medium text-yellow-500">{power}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4">
                        <div
                          className="bg-yellow-500 h-4 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${(power / 1000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-4">
                    {flipped ? (
                      <>
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
                          <span>{showPower ? 'Recalculate Power' : 'Calculate Power'}</span>
                        </button>
                        <button
                          onClick={join}
                          className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                          <GiBasketballBall className="text-xl" />
                          <span>Join Game</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setFlipped(true)}
                        className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                      >
                        <GiBasketballBall className="text-xl" />
                        <span>Draft Team</span>
                      </button>
                    )}
                  </div>
                </div>

                <CreateGame totalPower={power} setFlipped={setFlipped} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const gameData: GameStruct = await getGame(Number(id))
  const playerData = await getPlayers(Number(id))
  const structuredPlayers = (players): PlayerStruct[] =>
    players.map((player) => ({
      id: Number(player.id),
      gameId: Number(player.gameId),
      account: player.account,
      power: Number(player.power),
    }))

  const data = structuredPlayers(playerData)

  return {
    props: {
      gameData: JSON.parse(JSON.stringify(gameData)),
      playerData: JSON.parse(JSON.stringify(data)),
    },
  }
}
