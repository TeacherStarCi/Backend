import { Room, RoomSet, Player, SocketUser, User, Position } from "../../type";

export const getPlayerCurrentRoom = (socketId: string, roomSet: RoomSet): Room | null => {
    let result: Room | null = null;
    let resultWithUndefined: Room | undefined = roomSet.find(room =>
        typeof room.players.find(player =>
            player.socketUser.socketId == socketId) != 'undefined')
    if (typeof resultWithUndefined != 'undefined') {
        result = resultWithUndefined;
    }
    return result;
}

export const getPlayerCurrentRoomIndex = (socketId: string, roomSet: RoomSet): number => {
    let result: number = roomSet.findIndex(room =>
        typeof room.players.find(player =>
            player.socketUser.socketId == socketId) != 'undefined')
    return result;
}

export const getPlayerCurrentPositionInRoom = (socketId: string, roomSet: RoomSet): number => {
    const currentRoom: Room | null = getPlayerCurrentRoom(socketId, roomSet);
    let result: number = -1;
    if (currentRoom != null) {
        result = currentRoom.players.findIndex(player =>
            player.socketUser.socketId == socketId);
    }
    return result;
}

export const deletePlayerFromRoom = (socketId: string, roomSet: RoomSet): void => {
    const roomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet);
    const playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet);
    if (roomIndex != -1 && playerPosition != -1) {
        roomSet[roomIndex].players.splice(playerPosition, 1);
        if (!roomSet[roomIndex].players.length) {
            roomSet.splice(roomIndex, 1);
        }
    }
}
export const getRoomFromCode = (code: string, roomSet: RoomSet): Room | null => {
    let result: Room | null = null;
    let resultWithUndefined: Room | undefined = roomSet.find(room => room.code == code);
    if (typeof resultWithUndefined != 'undefined') {
        result = resultWithUndefined;
    }
    return result;
}

export const getRoomIndexFromCode = (code: string, roomSet: RoomSet): number => {
    let result: number = roomSet.findIndex(room => room.code == code);
    return result;
}
export const setRoomToGame = (code: string, gameId: string, roomSet: RoomSet): void => {
    let roomIndex: number = getRoomIndexFromCode(code, roomSet);
    if (roomIndex != -1) {
        roomSet[roomIndex].gameId = gameId;
    }
}

export const setSocketUserPosition =
    (socketId: string, position: Position, roomSet: RoomSet) => {
        const roomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet);
        const playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet);
        if (roomIndex != -1 && playerPosition != -1) {
            roomSet[roomIndex].players[playerPosition].socketUser.position = position;
        }
    }
export const getNumberOfPlayers = (code: string, roomSet: RoomSet): number => {
    let room: Room | null = getRoomFromCode(code, roomSet);
    let result = -1;
    if (room != null) {
        result = room.players.length;
    }
    return result;
}

export const setSocketUserPositionWhenChangingRoom =
    (socketId: string, roomSet: RoomSet, when: 'toGameRoom' | 'toWaitingRoom'): void => {
        const roomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet);
        const playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet);
        if (roomIndex != -1 && playerPosition != -1) {
            switch (when) {
                case 'toGameRoom':
                    roomSet[roomIndex].players[playerPosition].socketUser.position = {
                        location: 'gameRoom',
                        state: 'indie'
                    };
                    break;
                case 'toWaitingRoom':
                    roomSet[roomIndex].players[playerPosition].socketUser.position = {
                        location: 'waitingRoom',
                    };
                    break;
            }
        }
    }

export const getPlayer = (socketId: string, roomSet: RoomSet): Player|null => {
    let result: Player|null = null;
    const roomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet);
    const playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet);
    if (roomIndex != -1 && playerPosition != -1){
        result = roomSet[roomIndex].players[playerPosition];
    }
    return result;
}

export const createPlayer =
    (socketId: string, user: User, code: string, roomSet: RoomSet): boolean => {
        let result: boolean = true;
     const roomIndex: number = getRoomIndexFromCode(code, roomSet);
     if (roomIndex != -1){
        const socketUser: SocketUser = {
            socketId: socketId,
            user: user,
            position: {
                location: 'gameRoom',
                state: 'indie'
            }
        }
        const numberOfPlayers: number = getNumberOfPlayers(code, roomSet);
        if (numberOfPlayers == 4){
        result = false;
        } else {
        const player: Player = {
            socketUser: socketUser,
            remain: true
        }
        roomSet[roomIndex].players.push(player);
     }
    }
    return result;
}

export const setSocketUserPositionInRoom =
    (code: string, roomSet: RoomSet, when: 'start' | 'terminate'): void => {
        const roomIndex: number = getRoomIndexFromCode(code, roomSet);
        const numberOfPlayers: number = getNumberOfPlayers(code, roomSet);
        if (roomIndex != -1 && numberOfPlayers != -1) {
            if (numberOfPlayers >= 1) {
                switch (when) {
                    case 'start':
                        for (let i: number = 0; i < numberOfPlayers; i++) {
                            roomSet[roomIndex].players[i].socketUser.position.state = 'inProgress';
                        }
                        break;
                    case 'terminate':
                        for (let i: number = 0; i < numberOfPlayers; i++) {
                            roomSet[roomIndex].players[i].socketUser.position.state = 'indie';
                        }
                        break;
                }

            }
        }
    }

export const createNewRoom = 
(code: string, betAmount: number, socketId: string, roomSet: RoomSet): boolean => {
    let result: boolean = true;
    const roomIndex: number = getRoomIndexFromCode(code, roomSet);
    if (roomIndex != -1) {
        result = false;
    } else {
        const newRoom: Room = {
            code: code,
            betAmount: betAmount,
            players: []
        }
        roomSet.push(newRoom);
    }
    return result;
}

export const setPlayerRemain = 
(socketId: string, roomSet: RoomSet, toStatus: boolean): void => {
let playerCurrentRoomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet);
let playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet);
if (playerCurrentRoomIndex != -1 && playerPosition != -1){
    roomSet[playerCurrentRoomIndex].players[playerPosition].remain = toStatus;
}
}

export const deleteNotRemainPlayer =
(code: string, roomSet: RoomSet) => {
    const roomIndex: number = getRoomIndexFromCode(code, roomSet);
    const numberOfPlayers: number = getNumberOfPlayers(code, roomSet);
    if (roomIndex != -1 && numberOfPlayers != -1){
        if (numberOfPlayers > 0){
            for (let i: number = 0; i < numberOfPlayers; i++){
                const socketId: string = roomSet[roomIndex].players[i].socketUser.socketId;
                if (!roomSet[roomIndex].players[i].remain){
                    deletePlayerFromRoom(socketId, roomSet);
                }
            }
        }
    }
}

// let roomSetTest: RoomSet = [{
//     code: '1',
//     betAmount: 12,
//     players: [],
// },
// {
//     code: '2',
//     betAmount: 15,
//     players: [
//         {
//             socketUser: {
//                 socketId: '1',
//                 user: {
//                     address: 'star',
//                     asset: 12
//                 },
//                 position: {
//                     location: 'gameRoom',
//                     state: 'indie'
//                 }
//             }
            
//         }
//     ]

// }]

// console.dir(getPlayerCurrentRoom('1', roomSetTest), { depth: null });
// console.log('----');
// setSocketUserPositionInRoom('2', roomSetTest, 'start');
// setSocketUserPositionWhenChangingRoom('1', roomSetTest, 'toGameRoom');
// console.dir(roomSetTest, { depth: null });

