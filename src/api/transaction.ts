import { Application, Request, Response } from "express";
import { addTransaction, getUserWithTransaction, updateUser } from "../database";
import { Transaction, User } from "../type";

export const transactionApi = (app: Application) => {

    app.post('/deposit', async (req: Request, res: Response): Promise<void> => {
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
                const user: User|null = await getUserWithTransaction(transaction.sender);
                if (user != null){
                    user.asset += transaction.amount;
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