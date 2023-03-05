import { SocketUser } from "./authentication"
import { Hand } from "./deck"


export type Player = {
    socketUser: SocketUser,
    hand?: Hand,
    remain: boolean
}

export type Room = {
   code: string,
   betAmount: number,
   players: Player[],
   gameId?: string
}
export type RoomSet = Room[]

