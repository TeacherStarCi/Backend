import { PrismaClient, user } from '@prisma/client'
import { ppid } from 'process';
import { Transaction, User, VerifyToken } from '../type';
import { getTransaction } from './transaction';
const prisma = new PrismaClient();

export const addVerify = async (token: string): Promise<boolean> => {
    let result: boolean = true;
    await prisma.$connect();
    try {
        let verifyToken: VerifyToken = {
            token: token,
            available: true
        };
        await prisma.verify.create({
            data: verifyToken
        }
        );
    }
    catch (err: any) {
        result = false;
    }
    await prisma.$disconnect();
    return result;
}

export const setVerifyAvailable =
    async (token: string, toAvailable: boolean): Promise<boolean> => {
        let result: boolean = false;
        await prisma.$connect();
        try {
            const verifyToken: VerifyToken = await prisma.verify.findFirstOrThrow({
                where: {
                    token: token, available: !toAvailable
                }
            });
            verifyToken.available = toAvailable;
            await prisma.verify.update({
                where: {
                    token: verifyToken.token
                }, data: {
                    available: verifyToken.available
                }
            })
        }
        catch (err: any) {

        }
        await prisma.$disconnect();
        return result;

    }

export const checkVerifyToken =
    async (token: string): Promise<boolean> => {
        let result: boolean = true;
        await prisma.$connect();
        try {
            const verifyToken: VerifyToken = await prisma.verify.findFirstOrThrow({
                where: {
                    token: token, 
                    available: true
                }
            }
            );
        }
        catch (err: any) {
            result = false;
        }
        await prisma.$disconnect();
        return result;

    }

    checkVerifyToken('66eb7e07d6977bbb476db110b26a029ae9ea3f6e8cf769c95e59ab7cf7bd7e1').then(res => console.log(res))
