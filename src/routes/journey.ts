import { Router } from "express";
import { getAllJourneys } from "../services/journey";
import { JourneyGetRequest, JourneyGetResponse } from "../types";
import { validateOrderBy, validateOrderDir } from "../utils/validateJourney";

const journeyRouter = Router();

journeyRouter.get(
    "/",
    async (req: JourneyGetRequest, res: JourneyGetResponse) => {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const orderBy = validateOrderBy(req.query.orderBy);
        const orderDir = validateOrderDir(req.query.orderDir);
        const search = req.query.search;
        const durationMin = Number(req.query.durationMin) || 0;
        const durationMax = Number(req.query.durationMax) || 0;
        const distanceMin = Number(req.query.distanceMin) || 0;
        const distanceMax = Number(req.query.distanceMax) || 0;

        const journeys = await getAllJourneys(
            page,
            limit,
            orderBy,
            orderDir,
            search,
            durationMin,
            durationMax,
            distanceMin,
            distanceMax
        );

        res.json(journeys);
    }
);

export default journeyRouter;
