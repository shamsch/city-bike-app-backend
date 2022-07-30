import { orderByJourney, orderDir } from "../types";

export const validateOrderBy = (requestOrderBy: string): orderByJourney => {
    switch (requestOrderBy) {
        case 'id':
            return orderByJourney.id;
        case 'departure_station':
            return orderByJourney.departure_station;
        case 'departure_time':
            return orderByJourney.departure_time;
        case 'departure_station_id':
            return orderByJourney.departure_station_id;
        case 'return_station':
            return orderByJourney.return_station;
        case 'return_time':
            return orderByJourney.return_time;
        case 'return_station_id':
            return orderByJourney.return_station_id;
        case 'duration':
            return orderByJourney.duration;
        case 'covered_distance':
            return orderByJourney.covered_distance;
        case 'month':
            return orderByJourney.month;
        default:
            return orderByJourney.id;
    }
}



export const validateOrderDir = (requestOrderDir: string): orderDir => {
    switch (requestOrderDir) {
        case 'ASC':
            return 'asc';
        case 'DESC':
            return 'desc';
        default:
            return 'asc';
    }
}