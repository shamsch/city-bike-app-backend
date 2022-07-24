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

stationRouter.get("/:id", async (req: StationGetByIdRequest, res: StationGetByIdResponse) => {
    const id = Number(req.params.id);
    const station = await getStationById(id);
    res.json(station);
});

export default stationRouter;
