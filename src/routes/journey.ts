import {Router} from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const journeyRouter = Router();

journeyRouter.get('/', async (_req, res) => {
    const journeys = await prisma.journey.findMany();
    res.json(journeys);
}
);

export default journeyRouter;
