import { GasPrice, SigningStargateClient, StdFee } from "@cosmjs/stargate";
import { AccountData, Coin, DirectSecp256k1HdWallet, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { Application, Request, Response } from "express";
import { addTransaction, addVerify, checkVerifyToken, getUser, getUserWithTransaction, setVerifyAvailable, updateUser } from "../database";
import { getHashedFromCurrentTimestamp } from "../hash";
import { Transaction, User } from "../type";
import { DeliverTxResponse } from "@cosmjs/cosmwasm-stargate";


export const transactionApi = (app: Application) => {
    const exponent: number = 1 / 1000000;
    app.post('/get-verify-token', async (req: Request, res: Response): Promise<void> => {
        let resBody: { token: string } | {} = {};
        try {
            const verifyToken: string = getHashedFromCurrentTimestamp('verify');
            await addVerify(verifyToken);
            resBody = { token: verifyToken }
        }
        finally {
            res.json(resBody);
        }
    })


    app.post('/deposit', async (req: Request, res: Response): Promise<void> => {
        let resBody: User | {} = {};
        try {
            const reqBody: {
                txHash: string
            }
                = req.body;
            const txHash: string = reqBody.txHash;

            const lcdEndpontTxHash: string | undefined = process.env.LCD_ENDPOINT_TXHASH;
            if (typeof lcdEndpontTxHash != 'undefined') {
                const fetchRequestBody: any = await (await fetch(lcdEndpontTxHash + txHash)).json();
                const sender: string = fetchRequestBody.tx.body.messages[0].from_address;
                const receiver: string = fetchRequestBody.tx.body.messages[0].to_address;
                const result: boolean = fetchRequestBody.tx_response.code == 0;
                const amount: number = Number.parseInt(fetchRequestBody.tx.body.messages[0].amount[0].amount) * exponent;
                const fee: number = Number.parseInt(fetchRequestBody.tx.auth_info.fee.amount[0].amount) * exponent;
                const height: number = Number.parseInt(fetchRequestBody.tx_response.height);
                const time: Date = new Date(fetchRequestBody.tx_response.timestamp);

                const memoAsVerifyToken: string = fetchRequestBody.tx.body.memo;

                if (await checkVerifyToken(memoAsVerifyToken)) {
                    
                    await setVerifyAvailable(memoAsVerifyToken, false);
                    const transaction: Transaction = {
                        txHash: txHash,
                        sender: sender,
                        receiver: receiver,
                        result: result,
                        amount: amount,
                        fee: fee,
                        height: height,
                        time: time
                    }

                    await addTransaction(transaction);
                    const user: User | null = await getUser(sender);
                    if (user != null) {
                        user.asset += amount;
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
        let resBody: User | {} = {};
        try {
            const reqBody: {
                user: User,
                amount: number
            }
                = req.body;

            const user: User = reqBody.user;
            const address: string = user.address;
            const withdrawAmount: number = reqBody.amount;

            const mnemonic: string | undefined = process.env.MNEMONIC;
            const prefix: string | undefined = process.env.PREFIX;
            let gasPrice: GasPrice | null = null;
            const gasPriceString: string | undefined = process.env.GAS_PRICE;
            if (typeof gasPriceString != 'undefined') {
                gasPrice = GasPrice.fromString(gasPriceString);
            }
            const rpcEndpoint: string | undefined = process.env.RPC_ENDPOINT;

            if (typeof mnemonic != 'undefined'
                && typeof prefix != 'undefined'
                && gasPrice != null
                && typeof rpcEndpoint != 'undefined') {
                const signer: OfflineDirectSigner = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: prefix });
                const firstAccount: AccountData = (await signer.getAccounts())[0];
                const signingClient: SigningStargateClient = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer);

                const amount: Coin[] = [
                    { denom: "ueaura",
                     amount: (withdrawAmount / exponent).toString() 
                    }
                ]
                    ;
                const fee: StdFee = {
                    amount: [{ denom: "ueaura", amount: "200" }],
                    gas: "200000",
                }

                const withdrawResult: DeliverTxResponse = await signingClient.sendTokens(
                    firstAccount.address,
                    address,
                    amount,
                    fee
                )

                const txHash: string = withdrawResult.transactionHash;
                const lcdEndpontTxHash: string | undefined = process.env.LCD_ENDPOINT_TXHASH;
                if (typeof lcdEndpontTxHash != 'undefined') {
                    const fetchRequestBody: any = await (await fetch(lcdEndpontTxHash + txHash)).json();
                    const sender: string = fetchRequestBody.tx.body.messages[0].from_address;
                    const receiver: string = fetchRequestBody.tx.body.messages[0].to_address;
                    const result: boolean = fetchRequestBody.tx_response.code == 0;
                    const amount: number = Number.parseInt(fetchRequestBody.tx.body.messages[0].amount[0].amount) * exponent;
                    const fee: number = Number.parseInt(fetchRequestBody.tx.auth_info.fee.amount[0].amount) * exponent;
                    const height: number = Number.parseInt(fetchRequestBody.tx_response.height);
                    const time: Date = new Date(fetchRequestBody.tx_response.timestamp);
                    const transaction: Transaction = {
                        txHash: txHash,
                        sender: sender,
                        receiver: receiver,
                        result: result,
                        amount: amount,
                        fee: fee,
                        height: height,
                        time: time
                    }

                    console.log(transaction);

                    await addTransaction(transaction);
                    const user: User | null = await getUser(sender);
                    if (user != null) {
                        user.asset += amount;
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