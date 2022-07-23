import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getAllJourneys = async () => {
    const journeys = await prisma.journey.findMany();
    return journeys;
}
