import { Journey } from '@prisma/client';
import {Response, Request} from 'express';

export enum orderByJourney {
    id = 'id',
    departure_station = 'departure_station',
    departure_time = 'departure_time',
    departure_station_id = 'departure_station_id',
    return_station = 'return_station',
    return_time = 'return_time',
    return_station_id = 'return_station_id',
    duration = 'duration',
    covered_distance = 'covered_distance',
    month= 'month',
}

export type orderDir = 'asc' | 'desc';

export type JourneyGetRequest = Request & {
}
export type JourneyGetResponse = Response & {
    json(): Promise<Journey[]>;
}