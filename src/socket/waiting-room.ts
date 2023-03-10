import { DisconnectReason, Server, Socket } from 'socket.io';
import { Room, RoomSet, User } from '../type';
import { createNewRoom, createPlayer, getRoomFromCode, getRoomIndexFromCode, setSocketUserPositionWhenChangingRoom } from './utils';

export const waitingRoomSocket = (io: Server, socket: Socket, roomSet: RoomSet) => {
    socket.on('create new room request', (code: string, betAmount: number, user: User) => {
        const result: boolean = createNewRoom(code, betAmount, socket.id, roomSet);
        switch (result) {
            case true: socket.join(code);
           
            const roomIndex: number = getRoomIndexFromCode(code, roomSet);
                createPlayer(socket.id, user, code, roomSet);
                io.to(code).emit('update room', getRoomFromCode(code, roomSet));
    
                break;
            case false: socket.emit('fail to create new room');
                break;
        }
    
    })

    socket.on('show available room request', () => {
        io.emit('update room set', roomSet)
    });

    socket.on('join an existed room request', (code: string, user: User) => {
       const roomIndex: number  = getRoomIndexFromCode(code, roomSet);
       const createPlayerResult:boolean = createPlayer(socket.id, user, code, roomSet);
       switch (createPlayerResult) {
        case true:
        
        socket.join(code);
            io.to(code).emit('update room', getRoomFromCode(code, roomSet));
           //temp code
        
           break;  
        case false:
            socket.emit('fail to join the room');
            break;
       }
       console.log(getRoomFromCode(code, roomSet));
    })    

}