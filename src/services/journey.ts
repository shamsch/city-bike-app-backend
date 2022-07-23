import { PrismaClient } from "@prisma/client";
import { metersToKilometers, secondsToMinutes } from "../utils/convertUnit";

const prisma = new PrismaClient();

export const getAllJourneys = async (limit: number, page: number) => {
    const offset = (page - 1) * limit;
    const journeys = await prisma.journey.findMany({
        take: limit,
        skip: offset,
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
