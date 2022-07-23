import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getAllStations = async () => {
    const stations = await prisma.station.findMany();
    return stations;
}
