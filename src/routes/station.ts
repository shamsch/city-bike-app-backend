import { Router } from "express";
import { getAllStations, getStationById } from "../services/station";
import {
    StationGetRequest,
    StationGetResponse,
    StationGetByIdRequest,
    StationGetByIdResponse,
} from "../types";

const stationRouter = Router();

stationRouter.get(
    "/",
    async (req: StationGetRequest, res: StationGetResponse) => {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const search = req.query.search;
        const stations = await getAllStations(page, limit, search);
        res.json(stations);
    }
);

stationRouter.get(
    "/:id",
    async (req: StationGetByIdRequest, res: StationGetByIdResponse) => {
        const id = Number(req.params.id);
        const month = req.query.month? String(req.query.month) : null;

        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid id" });
        } else {
            const station = await getStationById(id, month);
            if (!station) {
                res.status(404).json({ error: "Station not found" });
            } else {
                res.json(station);
            }
        }
    }
);

export default stationRouter;
