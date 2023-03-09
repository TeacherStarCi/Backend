import { deck, deckdetail, PrismaClient, transaction } from '@prisma/client'
import { getHashedFromCurrentTimestamp } from '../hash';
import { DeckWithTransactionHash, DecksWithTransactionHash, Deck, CardPosition } from '../type';
const prisma = new PrismaClient();

export const addDeck = async (deck: DeckWithTransactionHash): Promise<boolean> => {
   let result: boolean = true;
   await prisma.$connect();
   try {
      const deckId: string = getHashedFromCurrentTimestamp('deck');
      const deckData: deck = {
         txHash: deck.txHash,
         index: deck.index,
         deckId: deckId
      }
      await prisma.deck.create(
         {
            data: deckData
         }
      )

      if (deck.deck.length > 0) {

         for (let i: number = 0; i < deck.deck.length; i++) {
            const deckDetailData: deckdetail = {
               deckId: deckId,
               cardValue: deck.deck[i].cardValue,
               cardPosition: deck.deck[i].cardPosition
            }
            await prisma.deckdetail.create({
               data: deckDetailData
            }
            )
         }
      }

   } catch (err: any) {
      result = false;
   }
   await prisma.$disconnect();
   return result;
}

export const addDecks = async (decks: DecksWithTransactionHash): Promise<boolean[]> => {
   const results: boolean[] = [];
   await prisma.$connect();
   if (decks.length > 0) {
      let result: boolean = true;
      for (let i: number = 0; i++; i < decks.length) {
         try {
            await addDeck(decks[i]);
         } catch (err: any) {
            result = false;
         }
         results.push(result);
      }
   }
   await prisma.$disconnect();
   return results;
}

export const getDecks = async (txHash: string): Promise<DecksWithTransactionHash> => {
   let results: DecksWithTransactionHash = [];
   await prisma.$connect();
   const decks: deck[] = await prisma.deck.findMany({
      where: {
         txHash: txHash
      }
   });
   if (decks.length > 0) {
      for (let i: number = 0; i < decks.length; i++) {
         const deckId: string = decks[i].deckId;
         const deckDetails: deckdetail[] = await prisma.deckdetail.findMany({
            where: {
               deckId: deckId
            }
         })
         const cards: CardPosition[] = deckDetails.map(deckDetails => {
            return {
               cardValue: deckDetails.cardValue,
               cardPosition: deckDetails.cardPosition
            }
         });
         const deckWithTransactionHash: DeckWithTransactionHash = {
            txHash: txHash,
            index: decks[i].index,
            deck: cards
         }
         results.push(deckWithTransactionHash)
      }
   }

   await prisma.$disconnect();
   return results;
}

// addDeck({
//    txHash: '12433',
//    index: 5,
//    deck: [1,3,2,6]
// }).then(res => console.log(res))
// getDecks('12433').then(res=>console.log(res))