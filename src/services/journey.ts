import { PrismaClient } from "@prisma/client";
import { orderByJourney, orderDir } from "../types";
import { metersToKilometers, secondsToMinutes } from "../utils/convertUnit";

const prisma = new PrismaClient();

export const getAllJourneys = async (
    page: number,
    limit: number,
    orderBy: orderByJourney,
    orderDir: orderDir,
    search: string | undefined
) => {
    const offset = page === 1 ? 0 : (page - 1) * limit;
    
    let where = {};
    
    if (search) {
        where = {
            OR: [
                {
                    month: {
                        contains: search,
                        mode: "insensitive"
                    },
                },
                {
                    departure_station: {
                        contains: search,
                        mode: "insensitive"
                    },
                },
                {
                    return_station: {
                        contains: search,
                        mode: "insensitive"
                    },
                },
            ],
        } 
    }

    console.log(page, limit, orderBy, orderDir, search);

    const journeys = await prisma.journey.findMany({
        take: limit,
        skip: offset,
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
    return convertedJourney;
};
