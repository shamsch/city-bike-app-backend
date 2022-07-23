import { Router } from "express";
import { getAllStations } from "../services/station";

const stationRouter = Router();

stationRouter.get("/", async (_req, res) => {
    const stations = await getAllStations();
    res.json(stations);
});

export default stationRouter;
