import { PrismaClient, user } from '@prisma/client'
import { Transaction, User } from '../type';
import { getTransaction } from './transaction';
const prisma = new PrismaClient();

export const addUser = async (user: User): Promise<boolean> => {
    let result: boolean = true;


    const primsaUser: user = {
        address: user.address,
        username: user.username,
        asset: user.asset
    };

    await prisma.$connect();
    try {
        await prisma.user.create({
            data: primsaUser
        })
    } catch (err: any) {
        result = false;
    }
    await prisma.$disconnect();
    return result;
}

export const getUser = async (address: string): Promise<User | null> => {
    let result: User | null = null;
    await prisma.$connect();
    const prismaUser: user | null = await prisma.user.findUnique({
        where: {
            address: address
        }
    })


    let prismaUsername: string = '';
    if (prismaUser?.username != null) {
        prismaUsername = prismaUser.username;
    }

    if (prismaUser != null) {
        result = {
            address: prismaUser.address,
            username: prismaUsername,
            asset: prismaUser.asset
        }
    }

    await prisma.$disconnect();

    return result;
}

export const getUserWithTransaction = async (address: string): Promise<User | null> => {
    let result: User | null = null;
    await prisma.$connect();
    const prismaUser: user | null = await prisma.user.findUnique({
        where: {
            address: address
        }
    })

    if (prismaUser != null) {

        let prismaUsername: string = '';
        if (prismaUser.username != null) {
            prismaUsername = prismaUser.username;
        }
        const prismaDeposits: Transaction[] = await getTransaction(prismaUser.address, 'deposit');
        const prismaWithdraws: Transaction[] = await getTransaction(prismaUser.address, 'withdraw');
        result = {
            address: prismaUser.address,
            username: prismaUsername,
            asset: prismaUser.asset,
            deposits: prismaDeposits,
            withdraws: prismaWithdraws
        }
    }

    await prisma.$disconnect();

    return result;
}

export const updateUser = async (user: User): Promise<boolean> => {
    let result: boolean = true;
    await prisma.$connect();

    try {
        await prisma.user.update({
            where: {
                address: user.address
            },
            data: {
                username: user.username,
                asset: user.asset
            }
        })
    } catch (err: any) {
        result = false;
    }
    await prisma.$disconnect();
    return result;
}