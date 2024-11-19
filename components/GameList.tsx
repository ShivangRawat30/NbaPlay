'use client'

import React from 'react'
import { useDispatch } from 'react-redux'
import { Clock, Users, Trophy, Coins, Trash2 } from 'lucide-react'
import { GameStruct } from '@/utils/type.dt'
import { formatDate, truncate } from '@/utils/helper'
import { globalActions } from '@/store/globalSlices'
import GameActions from './GameActions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from 'next/link'

export default function GameList({ games = [] }: { games: GameStruct[] }) {
  const dispatch = useDispatch()
  const { setGame, setResultModal } = globalActions

  const openModal = (game: GameStruct) => {
    dispatch(setGame(game))
    dispatch(setResultModal('scale-100'))
  }

  return (
    <div className="container mx-auto my-10 px-4 h-[100%] bg-black mb-0 pb-10 text-blue-800">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary text-white">Game List</h1>
      {games.length < 1 ? (
        <Card className="bg-card text-card-foreground">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Trophy className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">No games available yet</p>
            <Button className="mt-4">Create a Game</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game: GameStruct) => (
            <Card key={game.id} className="bg-card hover:bg-accent transition-all duration-300 group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle 
                    onClick={() => openModal(game)}
                    className="text-2xl font-bold mb-1 text-primary group-hover:text-black transition-colors duration-200 cursor-pointer"
                  >
                    {`Game #${game.id}`}
                  </CardTitle>
                  {/* <GameActions game={game} /> */}
                </div>
                <CardDescription>
                  <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                    {truncate({
                      text: game.owner,
                      startChars: 6,
                      endChars: 4,
                      maxLength: 13,
                    })}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Users className="w-5 h-5 mr-2 text-muted-foreground" />
                          <span className="font-semibold">{game.participants}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Participants</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Coins className="w-5 h-5 mr-2 text-muted-foreground" />
                          <span className="font-semibold">{(game.stake)} ETH</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stake</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Trophy className="w-5 h-5 mr-2 text-muted-foreground" />
                          <span className="font-semibold">
                            {truncate({
                              text: game.winner || 'No winner yet',
                              startChars: 6,
                              endChars: 4,
                              maxLength: 13,
                            })}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Winner</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {/* <div className="flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                          <span className="font-semibold">{formatDate(game.createdAt)}</span>
                        </div> */}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Created At</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Badge variant={game.paidOut ? "success" : "secondary"}>
                    {game.paidOut ? "Paid Out" : "Not Paid Out"}
                  </Badge>
                  {game.deleted && (
                    <Badge variant="destructive" className="flex items-center">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Deleted
                    </Badge>
                  )}
                </div>
                <Button asChild className="w-full mt-4">
                  <Link href={`/gameplay/${game.id}`}>
                    Join Game
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}