import { prisma } from './prisma';

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Connecting to database via Prisma Client...');
    await prisma.$connect();
    console.log('Prisma Client connected successfully.');

    const count = await prisma.talent.count();
    console.log(`Database verified via Prisma. Total active stars: ${count}`);
  } catch (error) {
    console.error('Database initialization failed with Prisma:', error);
    throw error;
  }
};
