import { PrismaClient } from "@prisma/client";
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
    const cursorId = page === 1 ? 1 : ((page-1) * limit)+1;

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

    const journeys = await prisma.journey.findMany({
        take: limit,
        cursor: {
            id: cursorId,
        },
        orderBy: {
            [orderBy]: orderDir,
        },
        where,
    });

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
