export type Card = {
    cardName: 'Ace'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'Jack'|'Queen'|'King', 
    suit: 'Spades'|'Clubs'|'Diamonds'|'Hearts'
}
export type Hand = {
    cards: Card[],
    result: string,
    isWinner: boolean
}

export type Deck = Card[]

export type DeckWithRequestId = {
    requestId: string,
    index: number,
    deck: number[]
}

export type DecksWithRequestId = DeckWithRequestId[]