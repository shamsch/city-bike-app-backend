import {PrismaClient} from '@prisma/client';
import { count } from 'console';
import { metersToKilometers } from '../utils/convertUnit';

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
            id, 
        }, 
        select:{
            id: true, 
            name: true,
            address: true,
            departure_journey: {
                select: {
                    covered_distance: true,
                    departure_station: true,
                    return_station: true,
                }
            }, 
            return_journey: {
                select: {
                    covered_distance: true,
                    departure_station: true,
                    return_station: true,
                }
            }
        },
    });

    const totalDepartureJourneys = station?.departure_journey?.length || 0;
    const totalReturnJourneys = station?.return_journey?.length || 0;

    const averageDepartureDistance = (station?.departure_journey?.reduce((acc, curr) => acc + curr.covered_distance, 0) || 0) / totalDepartureJourneys;
    const averageReturnDistance = (station?.return_journey?.reduce((acc, curr) => acc + curr.covered_distance, 0) || 0) / totalReturnJourneys;

    const topDepartureStation = station?.departure_journey?.reduce((acc, curr) => {
        if(!acc[curr.return_station]) {
            acc[curr.return_station] = 1;
        }
        else {
            acc[curr.return_station] += 1;
        }
        return acc;
    }
    , {}) || {};

    const topDepartureStationName = Object.keys(topDepartureStation).sort((a, b) => topDepartureStation[b] - topDepartureStation[a]).slice(0, 5);

    const topReturnStation = station?.return_journey?.reduce((acc, curr) => {
        if(!acc[curr.departure_station]) {
            acc[curr.departure_station] = 1;
        }
        else {
            acc[curr.departure_station] += 1;
        }
        return acc;
    }
    , {}) || {};

    const topReturnStationName = Object.keys(topReturnStation).sort((a, b) => topReturnStation[b] - topReturnStation[a]).slice(0, 5);

    return {
        ...station,
        departure_journey: totalDepartureJourneys,
        return_journey: totalReturnJourneys,
        average_departure_distance: metersToKilometers(averageDepartureDistance),
        average_return_distance: metersToKilometers(averageReturnDistance),
        top_departure_station: topDepartureStationName,
        top_return_station: topReturnStationName,
    }
}
