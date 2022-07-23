import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getAllStations = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const stations = await prisma.station.findMany({
        take: limit,
        skip: offset
    });
    return stations;
}
