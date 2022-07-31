import { Journey, Station } from "@prisma/client";
import { Response, Request } from "express";

export enum orderByJourney {
    id = "id",
    departure_station = "departure_station",
    departure_time = "departure_time",
    departure_station_id = "departure_station_id",
    return_station = "return_station",
    return_time = "return_time",
    return_station_id = "return_station_id",
    duration = "duration",
    covered_distance = "covered_distance",
    month = "month",
}

export type orderDir = "asc" | "desc";

export interface JourneyGetRequest extends Request {
    query: {
        limit?: number;
        page?: number;
        orderBy?: string;
        orderDir?: string;
        search?: string;
        durationMin?: number;
        durationMax?: number;
        distanceMin?: number;
        distanceMax?: number;
    };
}
export type JourneyGetResponse = Response<Journey[]>;
export interface StationGetRequest extends Request {
    query:{
        limit?: number;
        page?: number;
        search?: string;
    }
}
export type StationGetResponse = Response<Station[]>;
export interface StationGetByIdRequest extends Request {
    params: {
        id: number;
    },
    query: {
        month?: string;
    };
}
export type StationGetByIdResponse = Response<Station>;
export interface StationPostRequest extends Request {
    body: {
        name: string;
        address: string;
        lat: number;
        lon: number;
        capacity: number;
    };
}

export type StationPostResponse = Response<Station>;

