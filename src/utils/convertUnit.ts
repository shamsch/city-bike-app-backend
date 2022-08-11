/**
 * This function converts seconds to minutes (unrounded)
 * @param seconds
 * @returns minutes
 * @example
 * convertSecondsToMinutes(3600) // 60
 * convertSecondsToMinutes(3601) // 60.016666666666666
 */
export const secondsToMinutes = (seconds: number) => {
	return seconds / 60;
};

/**
 * This function converts meters to kilometers (unrounded)
 * @param meters
 * @returns kilometers
 * @example
 * convertMetersToKilometers(1000) // 1
 * convertMetersToKilometers(1001) // 1.001
 */

export const metersToKilometers = (meters: number) => {
	return meters / 1000;
};

/**
 * This function converts minutes to seconds (unrounded)
 * @param minutes
 * @returns seconds
 * @example
 * convertMinutesToSeconds(60) // 3600
 * convertMinutesToSeconds(61) // 3660
 */
export const minutesToSeconds = (minutes: number) => {
	return minutes * 60;
};

/**
 * This function converts kilometers to meters (unrounded)
 * @param kilometers
 * @returns meters
 * @example
 * convertKilometersToMeters(1) // 1000
 * convertKilometersToMeters(1.001) // 1000.9999999999999
 */
export const kilometersToMeters = (kilometers: number) => {
	return kilometers * 1000;
};
