/**
 * This function takes a month, returns true if it is valid English full month name and false if it is not valid.
 * @param {string} toValidate
 * @returns {boolean} true if valid, false if not
 **/

export const validateMonth = (month: string) => {
	const months = [
		"january",
		"february",
		"march",
		"april",
		"may",
		"june",
		"july",
		"august",
		"september",
		"october",
		"november",
		"december",
	];
	return months.includes(month.toLowerCase());
};

/**
 * This function takes a date, returns true if it is valid English full date and false if it is not valid.
 * @param {string} date
 * @returns {boolean} true if valid, false if not
 **/

export const validateDate = (date: string) => {
	if (new Date(date).toString() === "Invalid Date") {
		return false;
	} else {
		return true;
	}
};
