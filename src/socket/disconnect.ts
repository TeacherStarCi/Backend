import { DisconnectReason, Server, Socket } from 'socket.io';
import { Player, RoomSet, Position, Room } from '../type';
import { deletePlayerFromRoom, getPlayer, getPlayerCurrentRoom, getRoomFromCode, setPlayerRemain } from './utils';

export const disconnectSocket = (io: Server, socket: Socket, roomSet: RoomSet) => {
   socket.on('disconnect', (reason: DisconnectReason) => {
      // print reason
      console.log(reason);

      let player: Player | null = getPlayer(socket.id, roomSet);
      const room: Room | null = getPlayerCurrentRoom(socket.id, roomSet);

      if (player != null && room != null) {
         // if player in a room, but not start a game
         const code: string = room.code;
         switch (player.socketUser.position) {
            case {
               location: 'gameRoom',
               state: 'indie'
            }:
               deletePlayerFromRoom(socket.id, roomSet);
               io.to(code).emit('update room', getRoomFromCode(code, roomSet));
               break;

            // if player in a room, and in a game
            case {
               location: 'gameRoom',
               state: 'inProgress',
            }:
               setPlayerRemain(socket.id, roomSet, false);
               io.to(code).emit('update room', getRoomFromCode(code, roomSet));
               break;
         }
      }
   }
   )
}