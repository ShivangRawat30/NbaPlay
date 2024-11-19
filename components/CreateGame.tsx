'use client'

import { createGame } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { GameParams, RootState } from '@/utils/type.dt'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateGameProps {
  totalPower: number
  setFlipped: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateGame({ totalPower, setFlipped }: CreateGameProps) {
  const { createModal } = useSelector((state: RootState) => state.globalStates)
  const dispatch = useDispatch()
  const { setCreateModal } = globalActions
  const [stake, setStake] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStake(e.target.value)
  }

  const closeModal = () => {
    dispatch(setCreateModal('scale-0'))
    setStake('')
  }

  const handleGameCreation = async (e: FormEvent) => {
    e.preventDefault()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        createGame(Number(stake), totalPower)
          .then((tx) => {
            console.log(tx)
            closeModal()
            setFlipped(true)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Game creation successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${createModal}`}
    >
      <div className="bg-black text-yellow-100 shadow-lg shadow-red-500/20 rounded-xl w-11/12 md:w-2/5 max-w-md p-6 border border-yellow-700">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">Create Game</h2>
            <Button variant="ghost" size="icon" onClick={closeModal} className="text-yellow-400 hover:text-red-400">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleGameCreation} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stake" className="text-sm font-medium text-yellow-200">Stake Amount</Label>
              <Input
                id="stake"
                placeholder="E.g. 2"
                type="number"
                value={stake}
                onChange={handleChange}
                step={0.0001}
                min={0.0001}
                required
                className="bg-gray-800 border-yellow-700 text-yellow-100 focus:ring-red-500 focus:border-red-500 placeholder-yellow-500/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-gray-900 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create Game
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}