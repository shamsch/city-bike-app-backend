import { Router } from "express";
import { getAllJourneys } from "../services/journey";

const journeyRouter = Router();

journeyRouter.get("/", async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const journeys = await getAllJourneys(limit, page);
    res.json(journeys);
});

export default journeyRouter;
