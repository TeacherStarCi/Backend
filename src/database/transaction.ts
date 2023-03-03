import { PrismaClient, transaction } from '@prisma/client'
import { Transaction, User } from '../type';
const prisma = new PrismaClient();
export const getTransaction = async (address: string, type: 'deposit'|'withdraw'): Promise<Transaction[]> => {

  let results: Transaction[] = [];
  await prisma.$connect();

  let transactions: transaction[] = [];
  switch (type) {
    case 'deposit':
      transactions = await prisma.transaction.findMany({
        where: {
          sender: address
        }
      })
      break;
    case 'withdraw':
      transactions = await prisma.transaction.findMany({
        where: {
          receiver: address
        }
      })
      break;
  }

  transactions.forEach(async (transaction) => {

    const result: Transaction = {
      txHash: transaction.txHash,
      sender: transaction.sender,
      receiver: transaction.receiver,
      result: transaction.result,
      amount: transaction.amount,
      fee: transaction.fee,
      height: transaction.height,
      time: transaction.time
    }
    results.push(result);

  })
  await prisma.$disconnect();
  return results;
}

export const addTransaction = async (transaction: Transaction): Promise<boolean> => {
  let result: boolean = true;
  await prisma.$connect();

  try {
    await prisma.transaction.create(
      {
        data: transaction
      }
    )
  } catch (err: any) {
    result = false;
  }

  await prisma.$disconnect();
  return result;
}