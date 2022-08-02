import {PrismaClient} from '@prisma/client';
import { count } from 'console';
import { metersToKilometers } from '../utils/convertUnit';
import { getStaticMapUrl } from '../utils/staticMapUrl';

const prisma = new PrismaClient();

export const getAllStations = async (page: number, limit: number, search: string|undefined) => {
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

    const totalStations = await prisma.station.count({
        where
    });
    const totalPages = Math.ceil(totalStations / limit);

    return {
        stations,
        total_pages: totalPages
    };
}

export const getStationById = async (id: number, month: String | undefined) => {
    
    let monthQuery = {};
    if(month) {
        monthQuery = {
            month: {
                equals: month,
                mode: "insensitive"
            }
        }
    }

        
    const station = await prisma.station.findUnique({
        where:{
            id,
        }, 
        select:{
            id: true, 
            name: true,
            address: true,
            lat: true,
            lon: true, 
            departure_journey: {
                where: {
                    ...monthQuery
                },
                select: {
                    covered_distance: true,
                    departure_station: true,
                    return_station: true,
                }
            }, 
            return_journey: {
                where: {
                    ...monthQuery
                },
                select: {
                    covered_distance: true,
                    departure_station: true,
                    return_station: true,
                }
            }
        },
    });

    if (!station) {
        return null;
    }   

    const staticMapUrl = getStaticMapUrl(station.lat, station.lon);

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
        static_map_url: staticMapUrl,
    }
}

export const addStation = async (name: string, address: string, lat: number, lon: number, capacity: number) => {
    const latitude = Number(lat);
    const longitude = Number(lon);
    const capacityNumber = Number(capacity);
    const station = await prisma.station.create({
        data: {
            name,
            address,
            lat: latitude,
            lon: longitude,
            capacity: capacityNumber,
        }
    });

    return station;
}

export const getStationOptions = async () => {
    const stations = await prisma.station.findMany({
        select: {
            id: true,
            name: true,
        }
    });

    return stations;
}
