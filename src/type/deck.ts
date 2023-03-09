export type CardNameValue = 'Ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Jack' | 'Queen' | 'King';
export type SuitValue = 'Spades' | 'Clubs' | 'Diamonds' | 'Hearts'
export type MarkValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type HandState = { state: 'Base', level: number } | { state: 'ThreeFaceCards' } | { state: 'Flush', begin: number } | { state: 'ThreeOfAKind', value: number };

export type Card = {
    cardName: CardNameValue,
    suit: SuitValue
}

export type Hand = {
    cards: Card[],
    result: HandState,
    isWinner: boolean
}

export type Deck = Card[]

export type CardPosition = {
    cardValue: number,
    cardPosition: number
}

export type DeckWithTransactionHash = {
    txHash: string,
    index: number,
    deck: CardPosition[]
}

export type DecksWithTransactionHash = DeckWithTransactionHash[]

export type CardedDeckWithTransactionHash = {
    txHash: string,
    index: number,
    deck: Card[]
}

export type CardedDecksWithTransactionHash = CardedDeckWithTransactionHash[]
