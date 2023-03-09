
import { DisconnectReason, Server as WebSocketServer, Socket } from 'socket.io';
import http, { Server as HttpServer } from "http";
import App from './api/app';
import express, { Application, Request, Response } from 'express';
import { authenticationApi } from './api/authentication';
import { Deck, DecksWithTransactionHash, RoomSet, Room, Player, SocketUser, User,  Position} from './type';
import { transactionApi } from './api/transaction';
import { gameRoomSocket, waitingRoomSocket } from './socket';
import { disconnectSocket } from './socket/disconnect';
import { gameApi } from './api';
import { jwtDecodeWithHashSecret, jwtSignWithHashSecret } from './hash/jwt';
import { getCards } from './service/random';


const app: Application = new App().app;
const httpServer: HttpServer = http.createServer(app);

const io: WebSocketServer = new WebSocketServer(httpServer, {
    cors: {
        origin: '*'
    }
}
);

//resouce
const roomSet: RoomSet =
    [
        {
            code: 'room1',
            betAmount: 100,
            players: [{
                socketUser: {
                    socketId: '1',
                    user: {
                        address: 'star1',
                        username: 'nhoc_ddd',
                        asset: 20
                    },
                    position: {
                        location: "waitingRoom"
                    },
                    
                },
                remain: true
            },
            {
                socketUser: {
                    socketId: '2',
                    user: {
                        address: '1',
                        username: 'nhoc_ddd',
                        asset: 20
                    },
                    position: {
                        location: "waitingRoom"
                    }
                },
                remain: true
            },
            {
                socketUser: {
                    socketId: '3',
                    user: {
                        address: 'sta3',
                        username: 'nhoc_ddd',
                        asset: 20
                    },
                    position: {
                        location: "waitingRoom"
                    }
                },
                remain: true
            },
            {
                socketUser: {
                    socketId: '4',
                    user: {
                        address: 'sta4',
                        username: 'nhoc_ddd',
                        asset: 20
                    },
                    position: {
                        location: "waitingRoom"
                    }
                },
                remain: true
            }
            ]
        }
    ]
    ;
const decks: DecksWithTransactionHash = []

// .env

// tao vi cua server - co menemonic (24 characters - keplr)
// cosmjs connect vao vi 
io.on('connection', (socket) => {
    waitingRoomSocket(io, socket, roomSet);
    disconnectSocket(io, socket, roomSet);
    gameRoomSocket(io, socket, roomSet, decks);
})

authenticationApi(app);
transactionApi(app);
gameApi(app);
httpServer.listen(3001);


