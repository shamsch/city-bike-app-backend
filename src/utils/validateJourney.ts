import { orderByJourney, orderDir } from "../types";

/**
 * Validates the column of the journey to be ordered by.
 * @param {string} requestOrderBy The column to be ordered by.
 * @returns {string} The column to be ordered by.
 * @example
 * validateOrderBy('duration') // 'duration'
 * validateOrderBy('distance') // 'distance'
 * validateOrderBy('invalid') // 'id'
 * validateOrderBy('') // 'id'
 */
export const validateOrderBy = (
	requestOrderBy: string | undefined
): orderByJourney => {
	switch (requestOrderBy) {
		case "id":
			return orderByJourney.id;
		case "departure_station":
			return orderByJourney.departure_station;
		case "departure_time":
			return orderByJourney.departure_time;
		case "departure_station_id":
			return orderByJourney.departure_station_id;
		case "return_station":
			return orderByJourney.return_station;
		case "return_time":
			return orderByJourney.return_time;
		case "return_station_id":
			return orderByJourney.return_station_id;
		case "duration":
			return orderByJourney.duration;
		case "covered_distance":
			return orderByJourney.covered_distance;
		case "month":
			return orderByJourney.month;
		default:
			return orderByJourney.id;
	}
};

/**
 * Validate the order direction
 * @param {string} requestOrderDir the order direction
 * @returns {string} the order direction
 * @example
 * validateOrderDir('ASC') // 'asc'
 * validateOrderDir('DESC') // 'desc'
 * validateOrderDir('desc') // 'asc'
 * validateOrderDir('asc') // 'asc'
 * validateOrderDir('what is meaning of life') // 'asc'
 */
export const validateOrderDir = (
	requestOrderDir: string | undefined
): orderDir => {
	switch (requestOrderDir) {
		case "ASC":
			return "asc";
		case "DESC":
			return "desc";
		default:
			return "asc";
	}
};
