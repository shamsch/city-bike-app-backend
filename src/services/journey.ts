import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getAllJourneys = async (limit:number, page:number) => {
    const offset = (page - 1) * limit;
    const journeys = await prisma.journey.findMany({
        take: limit,
        skip: offset
    });
    return journeys;
}
