
import { DisconnectReason, Server as WebSocketServer, Socket } from 'socket.io';
import http, { Server as HttpServer } from "http";
import App from './api/app';
import express, { Application, Request, Response } from 'express';
import { authenticationApi } from './api/authentication';
import { Deck, RoomSet, Session } from './type';
import { transactionApi } from './api/transaction';
import { waitingRoomSocket } from './socket';
import { disconnectSocket } from './socket/disconnect';
import { gameApi } from './api';
import { jwtDecodeWithHashSecret, jwtSignWithHashSecret } from './hash/jwt';


const app: Application = new App().app;
const httpServer: HttpServer = http.createServer(app);

const io: WebSocketServer = new WebSocketServer(httpServer, {
    cors: {
        origin: '*'
    }
}
);

//resouce
const roomSet: RoomSet = [];
const deck: Deck = []

// .env

// tao vi cua server - co menemonic (24 characters - keplr)
// cosmjs connect vao vi 
io.on('connection', (socket) => {
    waitingRoomSocket(io, socket, roomSet);
    disconnectSocket(io,socket,roomSet);
})

authenticationApi(app);
transactionApi(app);
gameApi(app);
httpServer.listen(3001);

