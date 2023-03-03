import { DisconnectReason, Server, Socket } from 'socket.io';
import { Player, RoomSet, Position } from '../type';
import { deletePlayerFromRoom, getPlayer } from './utils';

export const disconnectSocket = (io: Server, socket: Socket, roomSet: RoomSet) => {
   socket.on('disconnect', (reason: DisconnectReason) => {
      // print reason
      console.log(reason);
     
      let player: Player|null = getPlayer(socket.id, roomSet);
      if (player != null){
          // if player in a room, but not start a game
   
          switch (player.socketUser.position) {
            case {
               location: 'gameRoom',
               state: 'indie' 
            }: 
               
               deletePlayerFromRoom(socket.id, roomSet);
               io.emit('update room set', roomSet);
               break;

           // if player in a room, and in a game
            case {
               location: 'gameRoom',
               state: 'inProgress',
            }:
               break;
          }

        
       
      }
     

})
}