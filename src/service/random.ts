import { ExecuteResult, SigningCosmWasmClient, SigningCosmWasmClientOptions } from "@cosmjs/cosmwasm-stargate";
import { AccountData, Coin, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import { addDeck } from "../database";
import { getHashedFromCurrentTimestamp } from "../hash";
import {  DeckWithTransactionHash } from "../type";

export const getCards
    = async (): Promise<string> => {
        //from .env
        let result: string = '';
        const mnemonic: string | undefined = process.env.MNEMONIC;
        const prefix: string | undefined = process.env.PREFIX;
        const rpcEndpoint: string | undefined = process.env.RPC_ENDPOINT;
        const cardGameContract: string | undefined = process.env.CARD_GAME_CONTRACT;
        let gasPrice: GasPrice | undefined = undefined;
        const gasPriceString: string | undefined = process.env.GAS_PRICE;
        if (typeof gasPriceString != 'undefined') {
            gasPrice = GasPrice.fromString(gasPriceString);
        }
        if (typeof mnemonic != 'undefined' && typeof prefix != 'undefined'
            && typeof rpcEndpoint != 'undefined' && typeof cardGameContract != 'undefined' && typeof gasPrice != 'undefined') {
            const wallet: DirectSecp256k1HdWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix });
            const firstAccount: AccountData = (await wallet.getAccounts())[0];
            const options: SigningCosmWasmClientOptions = {
                prefix: prefix,
                gasPrice: gasPrice
            }
            const client: SigningCosmWasmClient =
                await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet, options);
            const serverAddress: string = firstAccount.address;
            const requestId: string = getHashedFromCurrentTimestamp('request');
            const funds: Coin[] = [
                {
                    denom: 'ueaura',
                    amount: '300'
                }
            ]
            const excuteResult: ExecuteResult = await client.execute(
                serverAddress,
                cardGameContract,
                {
                    shuffle_deck:
                    {
                        request_id: requestId,
                    }
                },
                "auto",
                "",
                funds
            )
            result = excuteResult.transactionHash;
            let decks: number[][] | null = null;
            const sleep = async (ms: number) => setTimeout(() => { }, ms);
            while (!decks) {
                decks = await client.queryContractSmart(cardGameContract, {
                    get_decks:
                    {
                        request_id: requestId,
                        num: 3
                    }
                }
                )
                await sleep(5000);
            }
            
            if (decks != null) {
                const length: number = decks.length;
                for (let i: number = 0; i < length; i++){
                    const deckWithTransactionHash: DeckWithTransactionHash = {
                        txHash: result,
                        index: i,
                        deck: decks[i]
                    }
                    await addDeck(deckWithTransactionHash);
                } 
            }
        }
        return result;
    }


