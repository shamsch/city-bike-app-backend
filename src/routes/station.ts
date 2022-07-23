import {Router} from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const stationRouter = Router();

stationRouter.get('/', async (_req, res) => {
    const stations = await prisma.station.findMany();
    res.json(stations);
}
);

export default stationRouter;