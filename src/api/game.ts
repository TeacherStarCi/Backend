import {Application, Request, response, Response} from 'express';
import { getCards } from '../service/random';
import {Session, SessionWithoutId, User} from '../type';
import 'dotenv/config';
import { GasPrice } from '@cosmjs/stargate';


export const gameApi = (app: Application) => {
    app.post('/get-cards', async (req: Request, res: Response): Promise<void> => { 
        await getCards();
      }
      )
} 
