import { Router } from "express";
import { getAllJourneys } from "../services/journey";
import { JourneyGetRequest, JourneyGetResponse } from "../types";
import { validateOrderBy, validateOrderDir } from "../utils/validateJourney";

const journeyRouter = Router();

journeyRouter.get("/", async (req: JourneyGetRequest, res: JourneyGetResponse) => {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const orderBy = validateOrderBy(req.query.orderBy);
    const orderDir = validateOrderDir(req.query.orderDir);


    const journeys = await getAllJourneys(limit, page, orderBy, orderDir);

    res.json(journeys);
});

export default journeyRouter;
