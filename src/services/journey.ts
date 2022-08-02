import { Journey, PrismaClient } from "@prisma/client";
import { orderByJourney, orderDir } from "../types";
import {
    metersToKilometers,
    secondsToMinutes,
    kilometersToMeters,
    minutesToSeconds,
} from "../utils/convertUnit";

const prisma = new PrismaClient();

export const getAllJourneys = async (
    page: number,
    limit: number,
    orderBy: orderByJourney,
    orderDir: orderDir,
    search: string | undefined,
    durationMin: number,
    durationMax: number,
    distanceMin: number,
    distanceMax: number
) => {
    const cursorId = page === 1 ? 1 : (page - 1) * limit + 1;
    const offset = (page - 1) * limit;

    let searchQuery = {};
    let durationQuery = {};
    let distanceQuery = {};

    if (durationMax > 0) {
        durationQuery = {
            duration: {
                gte: minutesToSeconds(durationMin),
                lte: minutesToSeconds(durationMax),
            },
        };
    }

    if (distanceMax > 0) {
        distanceQuery = {
            covered_distance: {
                gte: kilometersToMeters(distanceMin),
                lte: kilometersToMeters(distanceMax),
            },
        };
    }

    if (search) {
        searchQuery = {
            OR: [
                {
                    month: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    departure_station: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    return_station: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        };
    }

    const where = {
        ...searchQuery,
        ...durationQuery,
        ...distanceQuery,
    };

    let journeys:Journey[] = []; 

    if (orderBy === "id" && orderDir === "asc") {
         journeys = await prisma.journey.findMany({
            take: limit,
            cursor: {
                id: cursorId,
            },
            where,
        });
    }
    else {
        journeys = await prisma.journey.findMany({
            take: limit,
            skip: offset,
            orderBy: {
                [orderBy]: orderDir,
            },
            where,
        });
    }

    const convertedJourney = journeys.map((journey) => {
        return {
            ...journey,
            duration: secondsToMinutes(journey.duration),
            covered_distance: metersToKilometers(journey.covered_distance),
        };
    });

    const totalJourney = await prisma.journey.count({
        where,
    });
    const totalPages = Math.ceil(totalJourney / limit);

    return {
        journeys: convertedJourney,
        total_pages: totalPages,
    };
};

export const addJourney = async (
    month: string,
    departure_station: number, 
    return_station: number,
    duration: number,
    covered_distance: number,
    departure_time: Date, 
    return_time: Date
) => {
    // find departure station and return station in database
    const departureStation = await prisma.station.findUnique({
        where: {
            id: departure_station,
        },
    });
    const returnStation = await prisma.station.findUnique({
        where: {
            id: return_station,
        },
    });

    if (!departureStation || !returnStation) {
        return false; 
    }

    const journey = await prisma.journey.create({
        data: {
            departure_station_id: departureStation.id,
            return_station_id: returnStation.id,
            departure_station: departureStation.name, 
            return_station: returnStation.name,
            departure_time: new Date(departure_time),
            return_time: new Date(return_time),
            duration: duration, // already in seconds because of the conversion routes/journey.ts
            covered_distance: kilometersToMeters(covered_distance),
            month,
        },
    });

    if (!journey) {
        return false;
    }
    else {
        return journey; 
    }
}

