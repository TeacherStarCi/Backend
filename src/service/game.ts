import { getDecks } from "../database";
import { Card, CardedDecksWithTransactionHash, CardedDeckWithTransactionHash, CardNameValue, DecksWithTransactionHash, HandState, SuitValue } from "../type";

export const getCardFromIndex = (index: number): Card | null => {
    let result: Card | null = null;
    index -= 1;
    const cardNameIndex: number = (index - index % 4) / 4;
    const suitIndex: number = index % 4;

    let cardName: CardNameValue | null = null;
    let suit: SuitValue | null = null;

    switch (cardNameIndex) {
        case 0: cardName = 'Ace';
            break;
        case 1: cardName = '2';
            break;
        case 2: cardName = '3';
            break;
        case 3: cardName = '4';
            break;
        case 4: cardName = '5';
            break;
        case 5: cardName = '6';
            break;
        case 6: cardName = '7';
            break;
        case 7: cardName = '8';
            break;
        case 8: cardName = '9';
            break;
        case 9: cardName = '10';
            break;
        case 10: cardName = 'Jack';
            break;
        case 11: cardName = 'Queen';
            break;
        case 12: cardName = 'King';
            break;
    }

    switch (suitIndex) {
        case 0: suit = 'Spades';
            break;
        case 1: suit = 'Clubs';
            break;
        case 2: suit = 'Diamonds';
            break;
        case 3: suit = 'Hearts';
            break;
    }
    if (cardName != null && suit != null) {
        result = {
            cardName: cardName,
            suit: suit
        }
    }
    return result;
}

const getCardNameIndex = (cardName: CardNameValue): number => {
    let result: number = -1;
    switch (cardName) {
        case 'Ace': result = 1;
            break;
        case 'Jack': result = 11;
            break;
        case 'Queen': result = 12;
            break;
        case 'King': result = 13;
            break;
        default: result = Number.parseInt(cardName);
            break;
    }
    return result;
}

const getCardName = (index: number): CardNameValue | null => {
    let result: CardNameValue | null = null;
    switch (index) {
        case 1: result = 'Ace';
            break;
        case 2: result = '2';
            break;
        case 3: result = '3';
            break;
        case 4: result = '4';
            break;
        case 5: result = '5';
            break;
        case 6: result = '6';
            break;
        case 7: result = '7';
            break;
        case 8: result = '8';
            break;
        case 9: result = '9';
            break;
        case 10: result = '10';
            break;
        case 11: result = 'Jack';
            break;
        case 12: result = 'Queen';
            break;
        case 13: result = 'King';
            break;
    }
    return result;
}

export const getHandState = (cards: Card[]): HandState | null => {
    let result: HandState | null = null;
    if (cards.length == 3) {
        if (cards[0].cardName == cards[1].cardName
            && cards[1].cardName == cards[2].cardName) {
            result = { state: 'ThreeOfAKind', value: getCardNameIndex(cards[0].cardName) };
        } else {
            const minCardNameIndex: number = Math.min(
                getCardNameIndex(cards[0].cardName),
                getCardNameIndex(cards[1].cardName),
                getCardNameIndex(cards[2].cardName),
            )
            const maxCardNameIndex: number = Math.max(
                getCardNameIndex(cards[0].cardName),
                getCardNameIndex(cards[1].cardName),
                getCardNameIndex(cards[2].cardName),
            )

            const cardNameIndexSet: number[] = [
                getCardNameIndex(cards[0].cardName),
                getCardNameIndex(cards[1].cardName),
                getCardNameIndex(cards[2].cardName)
            ]

            const maxCardNameIndexPos: number = cardNameIndexSet.findIndex(
                cardNameIndex => cardNameIndex == maxCardNameIndex);

            const minCardNameIndexPos: number = cardNameIndexSet.findIndex(
                cardNameIndex => cardNameIndex == minCardNameIndex);

            if (maxCardNameIndexPos > minCardNameIndexPos) {
                cardNameIndexSet.splice(maxCardNameIndexPos, 1);
                cardNameIndexSet.splice(minCardNameIndexPos, 1);
            } else {
                cardNameIndexSet.splice(minCardNameIndexPos, 1);
                cardNameIndexSet.splice(maxCardNameIndexPos, 1);
            }

            const medCardNameIndex: number = cardNameIndexSet[0];

            if (maxCardNameIndex - medCardNameIndex == 1
                && medCardNameIndex - minCardNameIndex == 1) {
                result = { state: 'Flush', begin: minCardNameIndex }
            } else if (medCardNameIndex == 12 && minCardNameIndex == 1) {
                result = { state: 'Flush', begin: medCardNameIndex }
            } else {
                if (minCardNameIndex >= 11) {
                    result = { state: 'ThreeFaceCards' }
                } else {
                    result = { state: 'Base' }
                }
            }


        }
    }
    return result;
}

export const getValueableCardRank = (card: Card): number => {
    let result: number = -1;
    switch (card.suit) {
        case 'Spades': result = getCardNameIndex(card.cardName);
            break;
        case 'Clubs': result = 14 + getCardNameIndex(card.cardName);
            break;
        case 'Hearts': result = 28 + getCardNameIndex(card.cardName);
            break;
        case 'Diamonds': result = 42 + getCardNameIndex(card.cardName);
            break;
    }
    return result;
}

export const getMostValueableCardRank = (cards: Card[]): number => {
    let result: number = -1;
    if (cards.length == 3) {
        result = Math.max(
            getValueableCardRank(cards[0]),
            getValueableCardRank(cards[1]),
            getValueableCardRank(cards[2])
        )
    }
    return result;
}

export const getCardLevel = (cardName: CardNameValue): number => {
    let result: number = -1;
    switch (cardName) {
        case 'Jack': result = 10
            break;
        case 'Queen': result = 10
            break;
        case 'King': result = 10
            break;
        case 'Ace': result = 1
            break;
        default: result = Number.parseInt(cardName)
            break;
    }

    return result;
}

export const getHandRank = (cards: Card[]): number => {
    let result: number = -1;
    const handState: HandState | null = getHandState(cards);
    if (handState != null) {
        switch (handState.state) {
            case 'Base':

                result = 100 * ((getCardLevel(cards[0].cardName)
                    + getCardLevel(cards[1].cardName)
                    + getCardLevel(cards[2].cardName)) % 10)
                    + getMostValueableCardRank(cards);
                break;
            case 'ThreeFaceCards': result = 1000 + getMostValueableCardRank(cards);
                break;
            case 'Flush': result = 1000 + 100 * handState.begin + getMostValueableCardRank(cards);
                break;
            case 'ThreeOfAKind': result = 10000 + handState.value;
                break;
        }
    }
    return result;
}

export const getCardedDecks = (decksWithTransactionHash: DecksWithTransactionHash): CardedDecksWithTransactionHash => {
    const results: CardedDecksWithTransactionHash = [];
    if (decksWithTransactionHash.length > 0) {
        for (let i: number = 0; i < decksWithTransactionHash.length; i++) {

            const indexedDeck: number[] = decksWithTransactionHash[i].deck;
            const cardedDeck: (Card | null)[] = indexedDeck.map(card => getCardFromIndex(card));
            const modifiedCardedDeck: Card[] = [];

            cardedDeck.forEach(card => {
                if (card != null) {
                    modifiedCardedDeck.push(card);
                }
            }
            )
            const cardedDecksWithTransactionHash: CardedDeckWithTransactionHash
                = {
                txHash: decksWithTransactionHash[i].txHash,
                index: decksWithTransactionHash[i].index,
                deck: modifiedCardedDeck
            }
            results.push(cardedDecksWithTransactionHash);


        }
    }
    return results;
}
