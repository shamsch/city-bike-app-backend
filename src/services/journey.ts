import { Journey, PrismaClient } from "@prisma/client";
import { orderByJourney, orderDir } from "../types";
import {
	metersToKilometers,
	secondsToMinutes,
	kilometersToMeters,
	minutesToSeconds,
} from "../utils/convertUnit";

const prisma = new PrismaClient();

/**
 * Get all journeys, paginated
 * @param page page number
 * @param limit number of items per page
 * @param orderBy order by field
 * @param orderDir order direction
 * @param search search string
 * @param durationMin minimum duration
 * @param durationMax maximum duration
 * @param distanceMin minimum distance
 * @param distanceMax maximum distance
 * @returns {Promise<{journeys: Journey[], total_pages: number}>}
 */

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
	// pagination is done in two ways 
	// 1. using the offset and limit parameters approach
	// 2. using the cursor approach
	// the cursor approach is more efficient at scale if we are ordering by the index field (id)
	// but for the other fields we need to use the offset and limit approach to paginate
	// read more about it here: https://www.prisma.io/docs/concepts/components/prisma-client/pagination
	const cursorId = page === 1 ? 1 : (page - 1) * limit + 1;
	const offset = (page - 1) * limit;

	let searchQuery = {};
	let durationQuery = {};
	let distanceQuery = {};

	if (distanceMin > 0 && distanceMax > 0) {
		distanceQuery = {
			covered_distance: {
				gte: kilometersToMeters(distanceMin),
				lte: kilometersToMeters(distanceMax),
			},
		};
	} else if (distanceMin > 0) {
		distanceQuery = {
			covered_distance: {
				gte: kilometersToMeters(distanceMin),
			},
		};
	} else if (distanceMax > 0) {
		distanceQuery = {
			covered_distance: {
				lte: kilometersToMeters(distanceMax),
			},
		};
	}

	if (durationMin > 0 && durationMax > 0) {
		durationQuery = {
			duration: {
				gte: minutesToSeconds(durationMin),
				lte: minutesToSeconds(durationMax),
			},
		};
	} else if (durationMin > 0) {
		durationQuery = {
			duration: {
				gte: minutesToSeconds(durationMin),
			},
		};
	} else if (durationMax > 0) {
		durationQuery = {
			duration: {
				lte: minutesToSeconds(durationMax),
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

	let journeys: Journey[] = [];

	// if we are ordering by the index field (id) we can use the cursor approach as it is more efficient
	if (orderBy === "id" && orderDir === "asc") {
		journeys = await prisma.journey.findMany({
			take: limit,
			cursor: {
				id: cursorId,
			},
			where,
		});
	} 
	// if we are ordering by other fields we need to use the offset and limit approach
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

	// formats the journeys
	const convertedJourney = journeys.map((journey) => {
		return {
			...journey,
			duration: secondsToMinutes(journey.duration),
			covered_distance: metersToKilometers(journey.covered_distance),
		};
	});

	// gets the total number of journeys for pagination on the frontend
	const totalJourney = await prisma.journey.count({
		where,
	});
	const totalPages = Math.ceil(totalJourney / limit);

	return {
		journeys: convertedJourney,
		total_pages: totalPages,
	};
};

/**
 * Add a new journey
 * @param month month of the journey
 * @param departure_station departure station ID of the journey
 * @param return_station return station ID of the journey
 * @param duration duration of the journey
 * @param covered_distance covered distance of the journey
 * @returns {Promise<Journey>}
 */

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
	} else {
		return journey;
	}
};

/**
 * get the max and min values for the duration and distance
 * @returns {Promise<{maxDuration: number, maxDistance: number;}>}
 */

export const getMaxValues = async () => {
	const maxDuration = await prisma.journey.aggregate({
		_max: {
			duration: true,
		},
	});
	const maxDistance = await prisma.journey.aggregate({
		_max: {
			covered_distance: true,
		},
	});
	return {
		maxDuration: secondsToMinutes(maxDuration._max.duration || 0),
		maxDistance: metersToKilometers(maxDistance._max.covered_distance || 0),
	};
};
