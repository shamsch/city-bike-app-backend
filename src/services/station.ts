import {PrismaClient} from '@prisma/client';
import { count } from 'console';

const prisma = new PrismaClient();

export const getAllStations = async (page: number, limit: number, search: string) => {
    const offset = (page - 1) * limit;

    let where = {};

    if(search) {
        where = {
            name: {
                contains: search,
                mode: "insensitive"
            }
        }
    }

    const stations = await prisma.station.findMany({
        take: limit,
        skip: offset, 
        where
    });
    return stations;
}

export const getStationById = async (id: number) => {
    const station = await prisma.station.findUnique({
        where: {
            id
        }, 
        select:{
            id: true, 
            name: true,
            address: true,
            departure_journey: {
                select: {
                    id: true,
                }
            }, 
            return_journey: {
                select: {
                    id: true,
                }
            }
        }, 
    });

    const totalDepartureJourneys = station?.departure_journey?.length || 0;
    const totalReturnJourneys = station?.return_journey?.length || 0;

    return {
        ...station,
        departure_journey: totalDepartureJourneys,
        return_journey: totalReturnJourneys,
    }
}
