import { Router } from "express";
import { getAllJourneys } from "../services/journey";

const journeyRouter = Router();

journeyRouter.get("/", async (_req, res) => {
    const journeys = await getAllJourneys();
    res.json(journeys);
});

export default journeyRouter;
