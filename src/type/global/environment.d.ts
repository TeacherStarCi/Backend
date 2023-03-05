export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        MNEMONIC : string|undefined,
        PREFIX: string|undefined,
        RPC_ENDPOINT: string|undefined
        CARD_GAME_CONTRACT: string|undefined
        GAS_PRICE: string|undefined
        HASH_SECRET: string|undefined,
        LCD_ENDPOINT_TXHASH: string|undefined
    }
  }
}