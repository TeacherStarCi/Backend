import { PrismaClient, transaction } from '@prisma/client'
import { DecksWithRequestId, DeckWithRequestId} from '../type';
const prisma = new PrismaClient();

export const addDeck
= async (deckWithRequestId: DeckWithRequestId): Promise<boolean> => 
{
    let result: boolean = true;
    await prisma.$connect();
    try
    {
    await prisma.deck.create({
        data: deckWithRequestId
    })
    }
    catch(err: any){
        result = false;
    }
    await prisma.$disconnect();
    return result;
}



