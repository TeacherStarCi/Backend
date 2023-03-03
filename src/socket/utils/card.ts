import { Card, Deck, RoomSet } from "../../type";
import { getNumberOfPlayers, getRoomIndexFromCode } from "./room";

export const setAllPlayersHands = (code: string, roomSet: RoomSet, deck: Deck, when: 'getCard' | 'removeCard') => {
    const roomIndex: number = getRoomIndexFromCode(code, roomSet);
    const numberOfPlayer: number = getNumberOfPlayers(code, roomSet);
    if (roomIndex != -1 && numberOfPlayer != -1) {
        if (numberOfPlayer >= 1) {
            for (let i:number = 0; i < numberOfPlayer; i++) {
                switch (when) {
                    case 'getCard':
                        const cards: Card[] = [];
                        for (let j: number = 0; j < 3; j++){
                            cards.push(deck[3*i+j]);
                        }
                        //for fun ^^
                        roomSet[roomIndex].players[i].hand = {
                            cards: cards,
                            result: '9 NUT',
                            isWinner: true
                        }
                        break;

                    case 'removeCard':
                       roomSet[roomIndex].players[i].hand = undefined;
                        break;
                }
            }
        }
    }
}