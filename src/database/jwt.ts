import { PrismaClient, transaction } from '@prisma/client'
import { jwtDecodeWithHashSecret, jwtSignWithHashSecret } from '../hash/jwt';
import { JwtDecodedToken, JwtToken } from '../type';
const prisma = new PrismaClient();

export const addJwtToken = async (token: string): Promise<boolean> => {
    let result: boolean = true;
    await prisma.$connect();
    try {
        const jwtToken: JwtToken = { token: token };
        await prisma.jwt.create(
            {
                data: jwtToken
            }
        );
    } catch (err: any) {
        result = false;
    }
    await prisma.$disconnect();
    return result;
}
export const getLastedJwtTokenMatchedAddress = async (address: string): Promise<string|null> => {
    let result: string = '';
    let tokens: JwtToken[] = [];
    await prisma.$connect();
    tokens = await prisma.jwt.findMany();
    
    let lastedIat: number = 0;

    tokens.forEach(token => {
        const decode: JwtDecodedToken | null = jwtDecodeWithHashSecret(token.token);
        if (decode != null && decode.address == address && decode.iat > lastedIat) {
            result = token.token;
        }
    })

    await prisma.$disconnect();
    return result;
}
