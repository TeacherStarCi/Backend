import { Application, Request, Response } from "express";
import { addTransaction, getUserWithTransaction, updateUser } from "../database";
import {  } from "../hash";
import { getCards } from "../service/random";
import { Transaction, User} from "../type";

export const transactionApi = (app: Application) => {

    app.post('/get-verify-token', async (req: Request, res: Response): Promise<void> => {
        let resBody = {verifyToken: ''};
        try {
           await getCards();

        //    const addResult: boolean = await addTransaction(transaction);
        //    if (addResult){
        //     //check whether transaction result is true or false
        //     if (transaction.result){
        //         const user: User|null = await getUserWithTransaction(transaction.sender);
        //         if (user != null){
        //             user.asset += transaction.amount;
        //             await updateUser(user); 
        //             resBody = user;
        //         } 
        //     }
        // }
        }
        finally {
            res.json(resBody);
        }
    })


    app.post('/deposit', async (req: Request, res: Response): Promise<void> => {
        let resBody: User|{} = {};
        try {
            const reqBody: {
                txHash: string
            }
                = req.body;
            const txHash: string = reqBody.txHash;

            const response: any = await (await fetch(process.env.LCD_ENDPOINT + txHash)).json();
            console.log(response.tx_response);
        //    const addResult: boolean = await addTransaction(transaction);
        //    if (addResult){
        //     //check whether transaction result is true or false
        //     if (transaction.result){
        //         const user: User|null = await getUserWithTransaction(transaction.sender);
        //         if (user != null){
        //             user.asset += transaction.amount;
        //             await updateUser(user); 
        //             resBody = user;
        //         } 
        //     }
        // }
        }
        finally {
            res.json(resBody);
        }
    })

    app.post('/withdraw', async (req: Request, res: Response): Promise<void> => {
        let resBody: User|{} = {};
        try {
            const reqBody: {
                transaction: Transaction
            }
                = req.body;
            const transaction: Transaction = reqBody.transaction;
           const addResult: boolean = await addTransaction(transaction);
           if (addResult){
            //check whether transaction result is true or false
            if (transaction.result){
                const user: User|null = await getUserWithTransaction(transaction.receiver);
                if (user != null){
                    user.asset -= transaction.amount;
                    await updateUser(user); 
                    resBody = user;
                } 
            }
        }
        }
        finally {
            res.json(resBody);
        }
    })

    
}