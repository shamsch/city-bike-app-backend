import { Router } from "express";
import { getAllStations } from "../services/station";

const stationRouter = Router();

stationRouter.get("/", async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const stations = await getAllStations(limit, page);
    res.json(stations);
});

export default stationRouter;
