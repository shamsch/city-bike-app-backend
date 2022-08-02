import { Router } from "express";
import { body, validationResult } from "express-validator";
import { addJourney, getAllJourneys } from "../services/journey";
import {
    JourneyGetRequest,
    JourneyGetResponse,
    JourneyPostRequest,
} from "../types";
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

journeyRouter.post(
    "/add",
    body("month").isString(),
    body("departure_station").isNumeric(),
    body("return_station").isNumeric(),
    body("covered_distance").isNumeric(),
    body("departure_time").isString(),
    body("return_time").isString(),
    async (req: JourneyPostRequest, res: JourneyGetResponse) => {
        const error = validationResult(req);
        const dateError = new Date(req.body.month+"1").toString() === "Invalid Date" || new Date(req.body.return_time).toString() === "Invalid Date" || new Date(req.body.departure_time).toString() === "Invalid Date";
        
        const duration = (new Date(req.body.return_time).getTime() - new Date(req.body.departure_time).getTime())/1000; // in seconds from ms

        if (!error.isEmpty() || dateError) {
            res.status(400).json({ error: "Invalid data received" });
        }
        
        const {
            month,
            departure_station,
            return_station,
            covered_distance,
            departure_time,
            return_time,
        } = req.body;
        
        console.log(duration);

        const journey = await addJourney(
            month,
            Number(departure_station),
            Number(return_station),
            Number(duration),
            Number(covered_distance),
            new Date(departure_time),
            new Date(return_time)
        );

        if(journey) {
            res.json(journey);
        }
        else {
           res.status("400").json({ error: "Journey could not be added" });
        }
    }
);

export default journeyRouter;
