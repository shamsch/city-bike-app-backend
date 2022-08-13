import {PrismaClient} from '@prisma/client';
import { count } from 'console';
import { metersToKilometers } from '../utils/convertUnit';
import { getStaticMapUrl } from '../utils/staticMapUrl';

const prisma = new PrismaClient();

/**
 * Get all stations, paginated
 * @param page page number
 * @param limit number of items per page
 * @param search search string station name
 * @returns {Promise<{stations: Station[], total_pages: number}>}
 */
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
    // we use LIMIT and OFFSET to paginate the results here as the number of stations are not very large
    const stations = await prisma.station.findMany({
        take: limit,
        skip: offset, 
        where
    });
    // we use COUNT to get the total number of stations, for pagination on the frontend
    const totalStations = await prisma.station.count({
        where
    });
    const totalPages = Math.ceil(totalStations / limit);

    return {
        stations,
        total_pages: totalPages
    };
}
/**
 * Get station by id
 * @param id station id
 * @param month month to filter all calculations
 * @returns {Promise<Station>}
 */
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

    //using the foreign key to get the all the journeys of the station  
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

    // a static map url is created for the station
    const staticMapUrl = getStaticMapUrl(station.lat, station.lon);

    // total journey calculation
    const totalDepartureJourneys = station?.departure_journey?.length || 0;
    const totalReturnJourneys = station?.return_journey?.length || 0;

    // average journey distance calculation
    const averageDepartureDistance = (station?.departure_journey?.reduce((acc, curr) => acc + curr.covered_distance, 0) || 0) / totalDepartureJourneys;
    const averageReturnDistance = (station?.return_journey?.reduce((acc, curr) => acc + curr.covered_distance, 0) || 0) / totalReturnJourneys;

    // top five journey to and from station calculation
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

/**
 * Add a station
 * @param name station name
 * @param address station address
 * @param lat station latitude
 * @param lon station longitude
 * @param capacity station capacity
 * @returns {Promise<Station>}
 */
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

/**
 * Returns a list of ALL stations  with id and name
 * @return {Promise<{id, name}[]>}
 */
export const getStationOptions = async () => {
    const stations = await prisma.station.findMany({
        select: {
            id: true,
            name: true,
        }
    });

    return stations;
}
