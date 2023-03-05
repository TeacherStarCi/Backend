import { Server, Socket } from "socket.io"
import { getCardFromIndex, getHandRank, getHandState } from "../service/game";
import { getCards } from "../service/random";
import { Card, Deck, DecksWithTransactionHash, DeckWithTransactionHash, RoomSet, Player, Hand, HandState, Room } from "../type"
import { deleteNotRemainPlayer, getNumberOfPlayers, getRoomFromCode, getRoomIndexFromCode, setAllPlayersHandsWhenStart, setAllPlayersHandsWhenTerminate, setAsset, setSocketUserPositionInRoom } from "./utils";

export const gameRoomSocket = (io: Server, socket: Socket,
    roomSet: RoomSet, deckStorage: DecksWithTransactionHash) => {
    socket.on('start game request', async (code: string) => {
        let txHash: string = '';
        if (deckStorage.length == 0) {
            // the storage is empty
            txHash = await getCards();
        } else {
            txHash = deckStorage[0].txHash;
        }
        const gameDeck: DeckWithTransactionHash | undefined = deckStorage.pop();
        // console.log(deckStorage);
        if (typeof gameDeck != 'undefined') {
           const winnerPosition: number = setAllPlayersHandsWhenStart(code, roomSet, gameDeck);
       
           setSocketUserPositionInRoom(code, roomSet, "start");
           const thisRoom: Room|null = getRoomFromCode(code, roomSet);
          if (thisRoom != null){
           await setAsset(code, roomSet, thisRoom.betAmount, winnerPosition);
          }
            io.to(code).emit('update room', getRoomFromCode(code, roomSet));
            socket.emit('update room', getRoomFromCode(code, roomSet))
        }
    }

    )
    socket.on('terminate game request', async (code: string) => {
        
        setAllPlayersHandsWhenTerminate(code, roomSet);
        setSocketUserPositionInRoom(code, roomSet, "terminate");
        deleteNotRemainPlayer(code, roomSet);
        
        io.to(code).emit('update room', getRoomFromCode(code, roomSet));
    }
    )

}