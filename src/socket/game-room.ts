import { DisconnectReason, Server, Socket } from 'socket.io';
import { RoomSet } from '../type';

export const socketDisconnect = (io: Server, socket: Socket, roomSet: RoomSet) => {
    socket.on('disconnect', (reason: DisconnectReason) => {
    // if player in a room, but not start a game
    
    // if player in a room, and in a game
     
 
 })
 }